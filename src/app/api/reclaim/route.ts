import { NextRequest } from "next/server";

import { Reclaim } from "@reclaimprotocol/js-sdk";

import { produceJWTSecret } from "@/lib/jwt";
import PROVIDERS from "@/lib/reclaim/providers";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const provider = searchParams.get("provider");
  const reclaimClient = new Reclaim.ProofRequest(process.env.RECLAIM_APP_ID!);

  if (!provider || !PROVIDERS[provider]) {
    return new Response("Invalid provider", { status: 400 });
  }

  await reclaimClient.buildProofRequest(PROVIDERS[provider!]);
  reclaimClient.setSignature(
    await reclaimClient.generateSignature(
      process.env.RECLAIM_SECRET_KEY!, //TODO : Update APP_SECRET with your app secret
    ),
  );
  const data = {
    requestUrl: "",
    verified: false,
    jwt: "",
  };
  let controller: ReadableStreamDefaultController;
  const dataStream = new ReadableStream({
    start(streamController) {
      controller = streamController;
      (async () => {
        const encoder = new TextEncoder();
        const { requestUrl, statusUrl } =
          await reclaimClient.createVerificationRequest();
        console.log("requrest url: ", requestUrl);
        console.log("status url: ", statusUrl);

        data.requestUrl = requestUrl;

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

        await reclaimClient.startSession({
          onSuccessCallback: async (proofs) => {
            data.verified = await Reclaim.verifySignedProof(proofs[0]);
            if (data.verified) {
              console.log(data);
              data.jwt = produceJWTSecret({ identifier: proofs[0].identifier });
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
            );
            controller.close();
          },
          onFailureCallback: (_) => {
            controller.close();
          },
        });
      })();
    },
    cancel() {
      controller.close();
      console.log("Stream cancelled");
    },
  });

  return new Response(dataStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
    },
  });
}
