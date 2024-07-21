"use client";

import { Button } from "@/components/ui/button";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  mintToCollectionV1,
  MPL_BUBBLEGUM_PROGRAM_ID,
  mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum";
import Navbar from "@/components/Common/Navbar";
import {
  createNft,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

// import {
//   createNftMetadata,
//   getOrCreateKeypair,
//   getOrCreateCollectionNFT,
//   CollectionDetails,
// } from "./utils";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";

import {
  generateSigner,
  percentAmount,
  publicKey,
  Signer,
} from "@metaplex-foundation/umi";

const Page = () => {
  const wallet = useWallet();
  const umi = createUmi(
    process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
  ).use(mplBubblegum());
  umi.use(walletAdapterIdentity(wallet));
  const handleMint = async () => {
    if (!wallet.publicKey) {
      return;
    }
    const maxDepthSizePair: ValidDepthSizePair = {
      maxDepth: 3,
      maxBufferSize: 8,
    };
    const merkleTree = generateSigner(umi);
    const collectionMint = generateSigner(umi);
    // await createNft(umi, {
    //     mint: collectionMint,
    //     name: 'This is test',
    //     uri: 'https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/20_138_246/20_138_246.json',
    //     sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
    //     isCollection: true,
    //   }).sendAndConfirm(umi)

    const createTreeIx = createTree(umi, {
      merkleTree,
      maxDepth: maxDepthSizePair.maxDepth,
      maxBufferSize: maxDepthSizePair.maxBufferSize,
      public: false,
      canopyDepth: 0,
      compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
      logWrapper: publicKey(SPL_NOOP_PROGRAM_ID),
    });
    const data = (await createTreeIx)
      .sendAndConfirm(umi)
      .then(async (res) => {
        const [bubblegumSigner] = PublicKey.findProgramAddressSync(
          [Buffer.from("collection_cpi", "utf8")],
          new PublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
        );
        const mintIx = await mintToCollectionV1(umi, {
          leafOwner: publicKey(wallet.publicKey!),
          merkleTree: publicKey(merkleTree),
          leafDelegate: publicKey(wallet.publicKey!),
          collectionAuthority: umi.payer,
          collectionAuthorityRecordPda: MPL_BUBBLEGUM_PROGRAM_ID,
          collectionMint: publicKey(collectionMint),
          compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
          logWrapper: publicKey(SPL_NOOP_PROGRAM_ID),
          //   bubblegumSigner: publicKey(bubblegumSigner),
          treeCreatorOrDelegate: umi.payer,
          tokenMetadataProgram: publicKey(MPL_TOKEN_METADATA_PROGRAM_ID),
          metadata: {
            name: "My Compressed NFT",
            uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/20_138_246/20_138_246.json",
            sellerFeeBasisPoints: 500, // 5%
            collection: { key: publicKey(collectionMint), verified: false },
            creators: [
              { address: umi.identity.publicKey, verified: false, share: 100 },
            ],
          },
        }).sendAndConfirm(umi);

        console.log(mintIx);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex size-full items-center justify-center">
      <Navbar />
      <Button onClick={handleMint} className="mt-20">
        Mint
      </Button>
    </div>
  );
};

export default Page;
