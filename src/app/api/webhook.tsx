import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const body = req.body;

    // Handle the incoming request from Dialogflow CX
    // For example, you can fetch the intent name and parameters from the request
    const intent = body.queryResult.intent.displayName;
    const parameters = body.queryResult.parameters;

    console.log("Intent:", intent);
    console.log("Parameters:", parameters);

    // Craft a response to send back to Dialogflow CX
    const response = {
      fulfillmentMessages: [
        {
          text: {
            text: ["This is a response from your webhook!"],
          },
        },
      ],
    };

    res.status(200).json(response);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
