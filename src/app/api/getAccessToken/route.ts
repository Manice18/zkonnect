import { NextRequest, NextResponse } from "next/server";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { API } from "@huddle01/server-sdk/api";
import { SigninMessage } from "@/lib/SignInMessage";
import { PublicKey } from "@solana/web3.js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { roomId, address, displayName, expirationTime, signature, domain } =
    body;

  if (!roomId || !address) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  if (expirationTime < Date.now()) {
    return NextResponse.json({ error: "Signature expired" }, { status: 400 });
  }

  const api = new API({
    apiKey: process.env.API_KEY!,
  });

  const { data: roomDetails } = await api.getRoomDetails({
    roomId: roomId,
  });

  if (!roomDetails?.tokenGatingInfo) {
    return NextResponse.json(
      { error: "Room is not token gated" },
      { status: 400 },
    );
  }

  const signInMessage = new SigninMessage({
    domain,
    publicKey: address,
    expTime: new Date(expirationTime).toISOString(),
    statement: "Please Sign In to verify wallet",
  });

  const isVerified = await signInMessage.validate(signature);

  if (!isVerified) {
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }

  const collectionAddress =
    roomDetails?.tokenGatingInfo?.tokenGatingConditions[0]?.contractAddress;

  const umi = createUmi(
    "https://mainnet.helius-rpc.com/?api-key=f1ef8b37-29b4-4b4b-9ca9-0ddf429d4e28",
  ).use(mplBubblegum());
  umi.use(dasApi());
  const rpcAssetList = await umi.rpc.getAssetsByOwner({
    // @ts-ignore
    owner: new PublicKey(address),
  });

  const exists = rpcAssetList.items.some((nft) =>
    nft.grouping.some((group) => group.group_value === collectionAddress),
  );

  if (!exists) {
    return NextResponse.json(
      { error: "User does not own the required NFT" },
      { status: 400 },
    );
  }

  const accessToken = new AccessToken({
    apiKey: process.env.API_KEY!,
    roomId: roomId as string,
    role: Role.HOST,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    options: {
      metadata: {
        displayName: displayName,
        walletAddress: address,
      },
    },
  });

  const token = await accessToken.toJwt();

  return NextResponse.json({ token });
}
