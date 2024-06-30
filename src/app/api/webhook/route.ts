import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  // const keyFileContent = fs.readFileSync('zkonnect-fd41635c9f7f.json', 'utf8');

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

  return NextResponse.json(response);
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
