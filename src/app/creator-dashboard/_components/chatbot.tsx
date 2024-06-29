"use client";
import React, { useState } from "react";
import { SessionsClient } from "@google-cloud/dialogflow-cx";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [input, setInput] = useState("");

  const projectId = "zkonnect";
  const location = "global";
  const agentId = "6baab077-51fe-40ee-9226-aed6272bbf56";
  const languageCode = "en";

  const client = new SessionsClient();

  const detectIntentText = async (query: string) => {
    const sessionId = Math.random().toString(36).substring(7);
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId,
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
        },
        languageCode,
      },
    };
    const [response] = await client.detectIntent(request);
    const botMessages = response.queryResult.responseMessages
      .map((message: any) => message.text?.text)
      .filter(Boolean);
    const botResponse = botMessages.join("\n");

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: query, isUser: true },
      { text: botResponse, isUser: false },
    ]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      detectIntentText(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md rounded border border-gray-300 bg-white p-4 shadow">
        <div className="mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-2 rounded p-2 ${
                message.isUser
                  ? "self-end bg-blue-200"
                  : "self-start bg-gray-200"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            className="flex-1 rounded-l border border-gray-300 p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-r bg-blue-500 p-2 text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
