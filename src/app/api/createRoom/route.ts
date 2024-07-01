import { NextRequest, NextResponse } from "next/server";

import { API } from "@huddle01/server-sdk/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collectionAddress = searchParams.get("collectionAddress");

  if (!collectionAddress) {
    return NextResponse.json(
      { error: "collectionAddress is required" },
      { status: 400 },
    );
  }

  const api = new API({
    apiKey: process.env.API_KEY!,
  });

  try {
    const createNewRoom = await api.createRoom({
      title: "Token Gated Room",
      tokenType: "SPL",
      chain: "SOLANA",
      contractAddress: [collectionAddress],
    });

    if (createNewRoom.error) {
      throw new Error();
    }

    return NextResponse.json({
      roomId: createNewRoom.data.data.roomId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
