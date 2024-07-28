import { NextRequest, NextResponse } from "next/server";

import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

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

const NFTURL =
  "https://raw.githubusercontent.com/Unboxed-Software/rgb-png-generator/master/assets/109_27_59/109_27_59.json";

async function getOrCreateCollectionNFT(
  metaplex: Metaplex,
  eventName: string,
  creatorAddr: string,
) {
  const collectionNft = await metaplex.nfts().create({
    uri: NFTURL,
    name: eventName,
    sellerFeeBasisPoints: 0,
    updateAuthority: Keypair.fromSecretKey(myPrivateKey),
    mintAuthority: Keypair.fromSecretKey(myPrivateKey),
    tokenStandard: 0,
    symbol: "",
    isMutable: true,
    isCollection: true,
    creators: [
      {
        address: new PublicKey(creatorAddr),
        share: 100,
      },
    ],
  });

  return {
    mint: collectionNft.mintAddress,
    metadata: collectionNft.metadataAddress,
  };
}

const metaplex = new Metaplex(connection);
metaplex.use(keypairIdentity(Keypair.fromSecretKey(myPrivateKey)));

export const POST = async (req: NextRequest) => {
  const { eventName, creatorAddress } = await req.json();

  try {
    const { metadata, mint } = await getOrCreateCollectionNFT(
      metaplex,
      eventName!,
      creatorAddress!,
    );
    return NextResponse.json(
      {
        metaData: metadata.toString(),
        mint: mint.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating collection", error);
    return NextResponse.json(
      { error: "Error creating collection" },
      { status: 500 },
    );
  }
};
