import { NextRequest } from "next/server";

import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Program, web3 } from "@coral-xyz/anchor";

import { Zkonnect } from "@/types/anchor_zkonnect";
import idl from "@/lib/solana/idl.json";

const isToken2022 = async (mint: PublicKey) => {
  const mintInfo = await connection.getAccountInfo(mint);
  return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
};
const getMintInfo = async (mint: PublicKey) => {
  const tokenProgram = (await isToken2022(mint))
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

  return getMint(connection, mint, undefined, tokenProgram);
};

const connection = new web3.Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
);

const program = new Program<Zkonnect>(idl as Zkonnect, {
  connection,
});

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const eventName = searchParams.get("eventName");
  const address = searchParams.get("address");

  if (!eventName) {
    return new Response("Invalid eventId", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const [profilePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("zkonnect"),
      new PublicKey(address!).toBuffer(),
      Buffer.from(utf8.encode(eventName)),
    ],
    program.programId,
  );
  const eventAccount = await program.account.event.fetch(profilePda);

  if (!eventAccount) {
    return new Response("Event not found", {
      status: 404,
      headers: ACTIONS_CORS_HEADERS,
    });
  } else {
    try {
      const requestUrl = new URL(req.url);
      const baseHref = new URL(
        `/api/actions/support?eventAccountPda=${profilePda.toString()}`,
        requestUrl.origin,
      ).toString();

      let actualPrice;

      if (eventAccount.paySol === 1) {
        const usdcMintAddr = new PublicKey(
          "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        );
        const mintInfo = await getMintInfo(usdcMintAddr);

        // Convert the BN ticket price to its actual value
        actualPrice =
          eventAccount.ticketPrice.toNumber() / Math.pow(10, mintInfo.decimals);
      } else {
        actualPrice = eventAccount.ticketPrice;
      }

      const payload: ActionGetResponse = {
        title: eventAccount.eventName,
        icon: eventAccount.banner,
        description: eventAccount.eventDescription,
        label: "Get Your Ticket", // this value will be ignored since `links.actions` exists
        links: {
          actions: [
            {
              label: `Send ${actualPrice} ${eventAccount.paySol === 0 ? "SOL" : "USDC"}`, // button text
              href: `${baseHref}`,
            },
          ],
        },
      };

      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      console.log(err);
      let message = "An unknown error occurred";
      if (typeof err == "string") message = err;
      return new Response(message, {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const eventAccountPda = searchParams.get("eventAccountPda");

  try {
    const body: ActionPostRequest = await req.json();
    const { account } = body;
    const authority = new web3.PublicKey(account);
    const eventAccount = await program.account.event.fetch(eventAccountPda!);
    const [profilePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("zkonnect"),
        eventAccount.creator.toBuffer(),
        Buffer.from(utf8.encode(eventAccount.eventName)),
      ],
      program.programId,
    );

    let ix: web3.TransactionInstruction;

    try {
      if (eventAccount.paySol === 0) {
        ix = await program.methods
          .paySolForTicket()
          .accountsPartial({
            to: eventAccount.creator,
            from: authority,
            event: profilePda,
          })
          .instruction();
      } else {
        const tokenProgram = (await isToken2022(eventAccount.mint))
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;

        const fromAta = getAssociatedTokenAddressSync(
          eventAccount.mint,
          authority,
          false,
          tokenProgram,
        );

        const toAta = getAssociatedTokenAddressSync(
          eventAccount.mint,
          eventAccount.creator,
          false,
          tokenProgram,
        );

        ix = await program.methods
          .payForTicket()
          .accountsPartial({
            to: eventAccount.creator,
            from: authority,
            event: profilePda,
            tokenProgram,
            fromAta,
            toAta,
            mint: eventAccount.mint,
          })
          .instruction();
      }

      const blockhash = await connection
        .getLatestBlockhash({ commitment: "max" })
        .then((res) => res.blockhash);
      const messageV0 = new web3.TransactionMessage({
        payerKey: authority,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();
      const transaction = new web3.VersionedTransaction(messageV0);

      const payload: ActionPostResponse = {
        transaction: Buffer.from(transaction.serialize()).toString("base64"),
        message: `Paid Successfully`,
      };

      const url = new URL(req.url);

      await fetch(`${url.origin}/api/getNFT`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorAddress: eventAccount.creator.toString(),
          merkleTreeAddr: eventAccount.merkleTree.toString(),
          collectionNFTAddr: eventAccount.collectionNft.toString(),
          toUserAddr: account,
          eventName: eventAccount.eventName,
          nftUri: eventAccount.nfturi,
        }),
      });

      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      console.log(err);
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
