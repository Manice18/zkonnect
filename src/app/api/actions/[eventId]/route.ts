import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ObjectId } from "bson";

import { db } from "@/lib/prisma";
import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";

export const GET = async (
  req: Request,
  { params }: { params: { eventId: string } },
) => {
  if (!params.eventId) {
    return new Response("Invalid eventId", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  if (!ObjectId.isValid(params.eventId)) {
    return new Response("Invalid eventId format", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const event = await db.blink.findUnique({
    where: {
      eventId: params.eventId,
    },
  });
  if (!event) {
    return new Response("Event not found", {
      status: 404,
      headers: ACTIONS_CORS_HEADERS,
    });
  } else {
    try {
      const requestUrl = new URL(req.url);
      // const { toPubkey } = validatedQueryParams(requestUrl);

      const baseHref = new URL(
        `/api/actions/${event.eventId}?to=${event.walletAddress}`,
        requestUrl.origin,
      ).toString();

      const payload: ActionGetResponse = {
        title: event.eventName,
        icon: event.blinkIcon, // Use the remote URL here
        description: event.eventDesc,
        label: "Transfer", // this value will be ignored since `links.actions` exists
        links: {
          actions: [
            {
              label: `Send ${event.ticketPrice} SOL`, // button text
              href: `${baseHref}&amount=${event.ticketPrice}`,
            },
            {
              label: "Send SOL", // button text
              href: `${baseHref}&amount={amount}`, // this href will have a text input
              parameters: [
                {
                  name: "amount", // parameter name in the `href` above
                  label: "Support my work", // placeholder of the text input
                  required: true,
                },
              ],
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

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount, toPubkey } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    );

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0, // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    const transaction = new Transaction();
    transaction.feePayer = account;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    );

    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

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
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
  let amount: number = DEFAULT_SOL_AMOUNT;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
    toPubkey,
  };
}
