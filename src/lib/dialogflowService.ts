import { SessionsClient } from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";
import { protos } from "@google-cloud/dialogflow";

type QueryResult = protos.google.cloud.dialogflow.v2.IQueryResult;

export async function runDialogflowQuery(
  queryText: string,
  projectId: string = "zkonnect",
): Promise<QueryResult> {
  const sessionId = uuidv4();

  const sessionClient = new SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId,
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: "en-US",
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    if (!result) {
      throw new Error("No query result");
    }

    console.log("Detected intent");
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);

    if (result.intent) {
      console.log(`Intent: ${result.intent.displayName}`);
    } else {
      console.log("No intent matched.");
    }

    return result;
  } catch (error) {
    console.error("Error detecting intent:", error);
    throw error;
  }
}
