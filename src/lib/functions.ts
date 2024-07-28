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

export async function createMerkleTree(totalNFTs: number, umi: Umi) {
  const { maxDepth, maxBufferSize } = getMaxDepthAndBufferSize(totalNFTs);
  const maxDepthSizePair: ValidDepthSizePair = {
    maxDepth: maxDepth,
    maxBufferSize: maxBufferSize,
  } as ValidDepthSizePair;
  const merkleTree = generateSigner(umi);

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
  (await createTreeIx).sendAndConfirm(umi);

  return merkleTree.publicKey;
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

const metadataURL =
  "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/109_27_59/109_27_59.json";

export function mintToCollection(
  umi: Umi,
  creator: UmiPublicKey,
  eventName: string,
  userAddr: UmiPublicKey,
  merkleTree: UmiPublicKey,
  collectionMint: UmiPublicKey,
) {
  const mintTx = mintToCollectionV1(umi, {
    leafOwner: userAddr,
    merkleTree: merkleTree,
    leafDelegate: umi.payer.publicKey,
    collectionAuthority: umi.payer,
    collectionAuthorityRecordPda: MPL_BUBBLEGUM_PROGRAM_ID,
    collectionMint: collectionMint,
    compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
    logWrapper: publicKey(SPL_NOOP_PROGRAM_ID),
    treeCreatorOrDelegate: umi.payer,
    tokenMetadataProgram: publicKey(MPL_TOKEN_METADATA_PROGRAM_ID),
    metadata: {
      name: eventName,
      symbol: "",
      uri: metadataURL,
      sellerFeeBasisPoints: 500,
      collection: {
        key: publicKey(collectionMint),
        verified: false,
      },
      creators: [
        {
          address: creator,
          verified: false,
          share: 100,
        },
      ],
    },
  });

  return mintTx;
}
