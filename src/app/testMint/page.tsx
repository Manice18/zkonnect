"use client";

import { Button } from "@/components/ui/button";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  mintToCollectionV1,
  mintV1,
  MPL_BUBBLEGUM_PROGRAM_ID,
  mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum";
import Navbar from "@/components/Common/Navbar";
import {
  createNft,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Metaplex,
  Nft,
  walletAdapterIdentity as waAI,
} from "@metaplex-foundation/js";
import type { CollectionDetails } from "@/types";

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
  none,
  percentAmount,
  publicKey,
  PublicKey as UmiPublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from "@metaplex-foundation/umi";

const Page = () => {
  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    "confirmed",
  );

  const umi = createUmi(connection).use(mplBubblegum());
  umi.use(walletAdapterIdentity(wallet));

  const metaplex = new Metaplex(connection);
  metaplex.use(waAI(wallet));

  async function getOrCreateCollectionNFT(
    connection: Connection,
    payer?: Keypair,
  ): Promise<CollectionDetails> {
    const collectionNft = await metaplex.nfts().create({
      uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/1_46_31/1_46_31.json",
      name: "New test1",
      sellerFeeBasisPoints: 0,
      updateAuthority: payer,
      mintAuthority: payer,
      tokenStandard: 0,
      symbol: "TEST",
      isMutable: true,
      isCollection: true,
    });

    return {
      mint: collectionNft.mintAddress,
      metadata: collectionNft.metadataAddress,
      // masterEditionAccount: (collectionNft as Nft).edition.address,
    };
  }

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

    const createTreeIx = createTree(umi, {
      merkleTree,
      maxDepth: maxDepthSizePair.maxDepth,
      maxBufferSize: maxDepthSizePair.maxBufferSize,
      public: false,
      canopyDepth: 0,
      compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
      logWrapper: publicKey(SPL_NOOP_PROGRAM_ID),
    });
    console.log("merkle tree:", merkleTree);
    console.log("collection mint:", collectionMint);
    const data = (await createTreeIx)
      .sendAndConfirm(umi)
      .then(async (res) => {
        // await mintV1(umi, {
        //   leafOwner: new PublicKey(wallet.publicKey!) as any as UmiPublicKey,
        //   merkleTree: new PublicKey(merkleTree.publicKey!) as any as UmiPublicKey,
        //   compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
        //   metadata: {
        //     name: "My Compressed NFT",
        //     uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/20_138_246/20_138_246.json",
        //     sellerFeeBasisPoints: 500, // 5%
        //     collection: none(),
        //     creators: [
        //       { address: umi.identity.publicKey, verified: false, share: 100 },
        //     ],
        //   },
        // }).sendAndConfirm(umi);
        const [bubblegumSigner] = PublicKey.findProgramAddressSync(
          [Buffer.from("collection_cpi", "utf8")],
          new PublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
        );
        const collectionNft = await getOrCreateCollectionNFT(connection);
        const mintInstructions = [];
        // const transactionBuilder = new TransactionBuilder();
        // const collectionNft = await metaplex.nfts().create({
        //     uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/20_138_246/20_138_246.json",
        //     name: "My Compressed NFTI",
        //     sellerFeeBasisPoints: 0,
        //     updateAuthority: waAI(wa),
        //     mintAuthority: umi,
        //     tokenStandard: 0,
        //     symbol: "Collection",
        //     isMutable: true,
        //     isCollection: true,
        //   });
        // await createNft(umi, {
        //   mint: collectionMint,
        //   name: "My Compressed NFT",
        //   authority: umi.payer,
        //   symbol: "NFTI",
        //   uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/20_138_246/20_138_246.json",
        //   sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
        //   isCollection: true,
        //   splAtaProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL") as any as UmiPublicKey,
        // }).sendAndConfirm(umi);
        for (let i = 0; i < 3; i++) {
          const mintIx = mintToCollectionV1(umi, {
            leafOwner: new PublicKey(wallet.publicKey!) as any as UmiPublicKey,
            merkleTree: new PublicKey(
              merkleTree.publicKey,
            ) as any as UmiPublicKey,
            leafDelegate: new PublicKey(
              wallet.publicKey!,
            ) as any as UmiPublicKey,
            collectionAuthority: umi.payer,
            collectionAuthorityRecordPda: MPL_BUBBLEGUM_PROGRAM_ID,
            collectionMint: new PublicKey(
              collectionNft.mint,
            ) as any as UmiPublicKey,
            compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
            logWrapper: publicKey(SPL_NOOP_PROGRAM_ID),
            // bubblegumSigner: publicKey(bubblegumSigner),
            treeCreatorOrDelegate: umi.payer,
            tokenMetadataProgram: publicKey(MPL_TOKEN_METADATA_PROGRAM_ID),
            metadata: {
              name: `${"Under new test1"} ${i}`,
              symbol: "TEST",
              uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/216_9_20/216_9_20.json",
              sellerFeeBasisPoints: 500, // 5%
              collection: {
                key: publicKey(collectionNft.mint),
                verified: false,
              },
              creators: [
                {
                  address: umi.identity.publicKey,
                  verified: false,
                  share: 100,
                },
              ],
            },
          });
          mintInstructions.push(mintIx);
        }

        const tx = transactionBuilder().add(mintInstructions);

        const result = await tx.sendAndConfirm(umi);
        console.log("Transaction result:", result);
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
