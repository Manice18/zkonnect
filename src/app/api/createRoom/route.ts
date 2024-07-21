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
    const startTime = new Date("2024-07-20T20:14:00Z");
    const expiryTime = new Date("2024-07-20T20:16:00Z");
    const createNewRoom = await api.createRoom({
      title: "Token Gated Room",
      tokenType: "SPL",
      chain: "SOLANA",
      contractAddress: [collectionAddress],
      // startTime: startTime.toISOString(),
      // expiryTime: expiryTime.toISOString(),
      // hostWallets: ["2M8bv4tBRrpZHiGJ1s1p1s1KQYJNvfXqnrCc2FcRanHy"],
    });

    console.log(createNewRoom);

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
