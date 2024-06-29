import { runDialogflowQuery } from "@/lib/dialogflowService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }
    const result = await runDialogflowQuery(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing Dialogflow query:", error);
    return NextResponse.json(
      { error: "Error processing Dialogflow query" },
      { status: 500 },
    );
  }
}
