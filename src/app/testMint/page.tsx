"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  mintToCollectionV1,
  mintV1,
  mplBubblegum,
  MPL_BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  createNft,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Metaplex,
  Nft,
  walletAdapterIdentity as waAI,
} from "@metaplex-foundation/js";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Common/Navbar";
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
  keypairIdentity,
} from "@metaplex-foundation/umi";

const Page = () => {
  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    "confirmed",
  );

  const umi = createUmi(connection).use(mplBubblegum());
  umi.use(walletAdapterIdentity(wallet));

  const newUmi = createUmi(connection).use(mplBubblegum());
  const myPrivateKey = Uint8Array.from([
    18, 127, 152, 242, 81, 58, 14, 97, 54, 82, 28, 4, 105, 231, 85, 5, 75, 0,
    116, 137, 173, 163, 186, 206, 250, 246, 247, 98, 76, 251, 178, 222, 151,
    100, 154, 138, 140, 79, 254, 173, 185, 93, 245, 157, 112, 117, 13, 0, 249,
    35, 170, 91, 207, 242, 204, 163, 154, 121, 243, 252, 5, 35, 77, 217,
  ]);
  const meKeypair = umi.eddsa.createKeypairFromSecretKey(myPrivateKey);

  newUmi.use(keypairIdentity(meKeypair));

  const metaplex = new Metaplex(connection);
  metaplex.use(waAI(wallet));

  async function createCollectionNFT(
    payer?: Keypair,
  ): Promise<CollectionDetails> {
    const collectionNft = await metaplex.nfts().create({
      uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/1_46_31/1_46_31.json",
      name: "Late nft",
      sellerFeeBasisPoints: 0,
      updateAuthority: payer,
      mintAuthority: payer,
      tokenStandard: 0,
      symbol: "WHAT",
      isMutable: true,
      isCollection: true,
      creators: [
        {
          address: new PublicKey(umi.identity.publicKey),
          share: 100,
        },
      ],
    });

    console.log("Collection nft address: ", collectionNft.mintAddress);

    return {
      mint: collectionNft.mintAddress,
      metadata: collectionNft.metadataAddress,
    };
  }

  async function getOrCreateCollectionNFT(
    connection: Connection,
    payer?: Keypair,
  ): Promise<CollectionDetails> {
    const collectionNft = await metaplex.nfts().create({
      uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/1_46_31/1_46_31.json",
      name: "Late nft",
      sellerFeeBasisPoints: 0,
      updateAuthority: payer,
      mintAuthority: payer,
      tokenStandard: 0,
      symbol: "WHAT",
      isMutable: true,
      isCollection: true,
      creators: [
        {
          address: new PublicKey(umi.identity.publicKey),
          share: 100,
        },
      ],
    });

    console.log("Collection nft address: ", collectionNft.mintAddress);

    return {
      mint: collectionNft.mintAddress,
      metadata: collectionNft.metadataAddress,
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
        const [bubblegumSigner] = PublicKey.findProgramAddressSync(
          [Buffer.from("collection_cpi", "utf8")],
          new PublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
        );
        const collectionNft = await getOrCreateCollectionNFT(connection);
        const mintInstructions = [];
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
              name: `${"Late nft"} ${i}`,
              symbol: "WHAT",
              uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/216_9_20/216_9_20.json",
              sellerFeeBasisPoints: 500, // 5%
              collection: {
                key: publicKey(collectionNft.mint),
                verified: false,
              },
              creators: [
                {
                  address: umi.identity.publicKey,
                  share: 100,
                  verified: true,
                },
              ],
            },
          });
          mintInstructions.push(mintIx);
        }

        const tx = transactionBuilder().add(mintInstructions);
        const result = await tx.sendAndConfirm(umi);
        console.log("Transaction result:", result);
        console.log("mint instructions: ", mintInstructions);
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
