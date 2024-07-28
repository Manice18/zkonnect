import { mintToCollection } from "@/lib/functions";
import { Metaplex, keypairIdentity as KAI } from "@metaplex-foundation/js";
import {
  keypairIdentity,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { NextRequest } from "next/server";

const myPrivateKey = Uint8Array.from([
  18, 127, 152, 242, 81, 58, 14, 97, 54, 82, 28, 4, 105, 231, 85, 5, 75, 0, 116,
  137, 173, 163, 186, 206, 250, 246, 247, 98, 76, 251, 178, 222, 151, 100, 154,
  138, 140, 79, 254, 173, 185, 93, 245, 157, 112, 117, 13, 0, 249, 35, 170, 91,
  207, 242, 204, 163, 154, 121, 243, 252, 5, 35, 77, 217,
]);

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
  "confirmed",
);

const umi = createUmi(connection);

umi.use(keypairIdentity(umi.eddsa.createKeypairFromSecretKey(myPrivateKey)));

const metaplex = new Metaplex(connection);
metaplex.use(KAI(Keypair.fromSecretKey(myPrivateKey)));

const NFTURL =
  "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/109_27_59/109_27_59.json";

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  // const creatorAddress = searchParams.get("creatorAddress");
  // const merkleTreeAddr = searchParams.get("merkleTreeAddr");
  // const collectionNFTAddr = searchParams.get("collectionNFTAddr");
  // const toUserAddr = searchParams.get("toUserAddr");
  // const eventName = searchParams.get("eventName");
  const {
    creatorAddress,
    merkleTreeAddr,
    collectionNFTAddr,
    toUserAddr,
    eventName,
  } = await req.json();

  if (
    !creatorAddress ||
    !merkleTreeAddr ||
    !collectionNFTAddr ||
    !toUserAddr ||
    !eventName
  ) {
    return new Response("Invalid parameters", {
      status: 400,
    });
  }
  if (
    !publicKey(creatorAddress) ||
    !publicKey(merkleTreeAddr) ||
    !publicKey(collectionNFTAddr) ||
    !publicKey(toUserAddr)
  ) {
    return new Response("Invalid keys", {
      status: 400,
    });
  }

  const merkleTree = {
    publicKey: publicKey(merkleTreeAddr!),
  };

  const mintInstructions = [];
  mintInstructions.push(
    mintToCollection(
      umi,
      publicKey(creatorAddress!),
      eventName!,
      publicKey(toUserAddr!),
      merkleTree.publicKey,
      publicKey(collectionNFTAddr!),
    ),
  );

  const tx = await transactionBuilder()
    .add(mintInstructions)
    .sendAndConfirm(umi);

  console.log("Transaction: ", tx);

  return new Response("Success", {
    status: 200,
  });
};
