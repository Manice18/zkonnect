"use client";

import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  mintToCollectionV1,
  MPL_BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

import type { CollectionDetails } from "@/types";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";

import {
  generateSigner,
  publicKey,
  PublicKey as UmiPublicKey,
  transactionBuilder,
  Umi,
} from "@metaplex-foundation/umi";
import { Metaplex, Nft } from "@metaplex-foundation/js";
export const shortenWalletAddress = (walletAddress: string, len = 5) => {
  return walletAddress.slice(0, len) + "...." + walletAddress.slice(-len);
};

async function getOrCreateCollectionNFT(
  metaplex: Metaplex,
  creatorName: string,
  payer?: Keypair,
): Promise<CollectionDetails> {
  const collectionNft = await metaplex.nfts().create({
    uri: "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/1_46_31/1_46_31.json",
    name: `${creatorName} | Collection`,
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
  };
}

interface DepthBufferSize {
  maxDepth: 3 | 5 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 24 | 26 | 30;
  maxBufferSize: 8 | 64 | 256 | 512 | 1024 | 2048;
}

const depthBufferSizeChart: ValidDepthSizePair[] = [
  { maxDepth: 3, maxBufferSize: 8 },
  { maxDepth: 5, maxBufferSize: 8 },
  { maxDepth: 14, maxBufferSize: 64 },
  { maxDepth: 14, maxBufferSize: 256 },
  { maxDepth: 14, maxBufferSize: 1024 },
  { maxDepth: 14, maxBufferSize: 2048 },
  { maxDepth: 15, maxBufferSize: 64 },
  { maxDepth: 16, maxBufferSize: 64 },
  { maxDepth: 17, maxBufferSize: 64 },
  { maxDepth: 18, maxBufferSize: 64 },
  { maxDepth: 19, maxBufferSize: 64 },
  { maxDepth: 20, maxBufferSize: 64 },
  { maxDepth: 20, maxBufferSize: 256 },
  { maxDepth: 20, maxBufferSize: 1024 },
  { maxDepth: 20, maxBufferSize: 2048 },
  { maxDepth: 24, maxBufferSize: 64 },
  { maxDepth: 24, maxBufferSize: 256 },
  { maxDepth: 24, maxBufferSize: 512 },
  { maxDepth: 24, maxBufferSize: 1024 },
  { maxDepth: 24, maxBufferSize: 2048 },
  { maxDepth: 26, maxBufferSize: 512 },
  { maxDepth: 26, maxBufferSize: 1024 },
  { maxDepth: 26, maxBufferSize: 2048 },
  { maxDepth: 30, maxBufferSize: 512 },
  { maxDepth: 30, maxBufferSize: 1024 },
  { maxDepth: 30, maxBufferSize: 2048 },
];

function getMaxDepthAndBufferSize(totalTickets: number): ValidDepthSizePair {
  for (const entry of depthBufferSizeChart) {
    if (totalTickets <= 2 ** entry.maxDepth) {
      return entry;
    }
  }
  throw new Error(
    "Total number of tickets exceeds the maximum supported value.",
  );
}

export const handleCNFT = async (
  umi: Umi,
  wallet: WalletContextState,
  connection: Connection,
  metaplex: Metaplex,
  eventName: string,
  creatorName: string,
  totalNFTs: number,
) => {
  const { maxDepth, maxBufferSize } = getMaxDepthAndBufferSize(totalNFTs);
  const maxDepthSizePair: ValidDepthSizePair = {
    maxDepth: maxDepth,
    maxBufferSize: maxBufferSize,
  } as ValidDepthSizePair;
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
      const collectionNft = await getOrCreateCollectionNFT(
        metaplex,
        creatorName,
      );
      const mintInstructions = [];
      for (let i = 0; i < totalNFTs; i++) {
        const mintIx = mintToCollectionV1(umi, {
          leafOwner: new PublicKey(wallet.publicKey!) as any as UmiPublicKey,
          merkleTree: new PublicKey(
            merkleTree.publicKey,
          ) as any as UmiPublicKey,
          leafDelegate: new PublicKey(wallet.publicKey!) as any as UmiPublicKey,
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
            name: `${eventName} ${i}`,
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
