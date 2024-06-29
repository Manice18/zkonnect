import { NextRequest, NextResponse } from "next/server";
import { SessionsClient } from "@google-cloud/dialogflow-cx";

// Configure these variables with your Dialogflow CX details
const projectId = "zkonnect";
const location = "global";
const agentId = "6baab077-51fe-40ee-9226-aed6272bbf56";
const languageCode = "en";
const keyFileData = {
  type: "service_account",
  project_id: "zkonnect",
  private_key_id: "fd41635c9f7fbef23276ba376f737185b5819ba5",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDfG4wgIhqkuHL0\nGEU9Vv7znTf8HtEPJ/AvK544CUQmKThARdkDs1fgtZ/izGSSRN1dl/lJS0kOTT1K\n6DhaZUnVzQRun/hHbE4TZqKxu+MviHBhNIGoEaQlF2M+X951J9shjbVh+08+9Vp4\nwb7YRKnqM0Pud+eV7QM7Vc9a/DAu70HI5/n7wXs8VjYEyvz0XOBWwAdmvMxmQWnX\nh8gFyWN4zIUuoCVaEljwa76HOPu4FjUbRLEmYhk5xFXxl9o3IKmTBRXyi6JrYQLL\ncxmLdcNsO9nxkkZwC15JZBkCTXp/oqSnmkhLOrVHd8G3aEdRWuVIZB812y/Jcu+P\ntRjbYkD1AgMBAAECggEACOrldW1XikjzE02bCuIcy6j3kWS773Klt4TzTIMWTb4t\nCOihzXOQKiOoUdzgkjYdcP2/kY3oTCGLNyDEC9zrkBejOza6qkQqdL0P+LGtWXuH\nHmOGYSzfVjoylc4oKp+esx8iZlmwp7AP3y7DTYqlDf7hkrkJMSVpkSgTYywcUuvb\nJsq+o8oLrGq8lu0MLvZXmmMj21V3LaavYokPKtCBsjAkJgGUe4ZkniBfb4CPy9AB\nYjE7I25Zascv/jZNWLsz2eN8mVzz2/MSKWrzmZ4i6vy3mts07b4LXVGTyQcY11b6\nx+sZqkBmKntOciIrD3QutvJX8tUzn1vKOGyfXBiXEQKBgQDwtOoqcLGe2Rgv/mt9\n7aPsgLah4fo0g6fOrwg4bmNe+oK6mywHZ/ViTTcQtHrRdT5RYutT0V2tkqGpvyg+\nxULrUwLhJZsUM5L7jBjmBnWDrld6pIn8cAPU/SogyKoyE3sQNLjakSB3urvEXc4N\nHkH5Dn6zrTp6t0IiJVwmnwDObQKBgQDtSGJUyvVUyv1sn76f0C/6wJxCPbqUD/Wd\nMF7y2NwSmJfX802QbK1Lakeh3RoyPP++XlRyIegLkr+yKxPVlwwO9wVuuCrUM4L2\nPmmwgfLCS4lUQBoMPZnf2YwytJeE+LSwKi6gRGHVrQlMzyil1fAzzLpIexPigks6\n8r420ekHqQKBgBKQ8crqPFkTR7FT/3iMHuu8Fdowsvrf+M6RY6Huqc2GpxS7qU68\n7wlxCUFJmnuTfoYKijpB2Obte3i7XOBSmNHL6lnxa5/IRpsOeFEtyFyq0uaL0HTf\nMvx3tosmzzHjnMdoOaXqMcXqaldAIQeUAOS0AIPdZbhXcEtv9EaqVwaVAoGBANlC\nyL5I459TCf42uk0MS5I2YB0K9lZx0nut+ZI0XDUuwQG7Rg7yYy5FTvd3QnAziBtf\ntcSXJSfLo3hYlx2f4yukpLW/LYAE9mnPtegm5AdhMIoS84a3tLfRMtyOnJnlO1R+\nGxkl48rJWFWa7OYDYJ+dWgfZodhpYsbD0sTRKKSZAoGALCUywveHQjCG0nB0/UXs\nfpdrCoc2eQE5QcTXWDffSdFB7ihRZ5oT18p6fs3mKlUy2G1wsOHcdcXfcMIpT41w\nUiIXWM5q8lFDnoQuD9FOjspF5g0clAAO6H9bidVS0zNsxQIpCwiUNPM6ZhuA1LD2\nSSLh275rk0BqkBWWnU0Fkgg=\n-----END PRIVATE KEY-----\n",
  client_email: "zkonnect@zkonnect.iam.gserviceaccount.com",
  client_id: "111583695676895630450",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/zkonnect%40zkonnect.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
const credentials = JSON.parse(JSON.stringify(keyFileData));

const client = new SessionsClient();

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const sessionId = Math.random().toString(36).substring(7);
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId,
    );

    const dialogflowRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
        },
        languageCode,
      },
    };

    const [response] = await client.detectIntent(
      dialogflowRequest,
      credentials,
    );

    const messages = response
      .queryResult!.responseMessages!.map((message) =>
        message.text ? message.text!.text![0] : null,
      )
      .filter(Boolean);

    const intent = response.queryResult!.match!.intent
      ? response.queryResult!.match!.intent.displayName
      : null;

    const currentPage = response.queryResult!.currentPage!.displayName;

    return NextResponse.json({ messages, intent, currentPage });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
}
