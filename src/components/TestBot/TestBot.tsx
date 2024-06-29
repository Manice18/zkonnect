"use client";

import React, { useState, FormEvent } from "react";

export default function TestBot() {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/dialogflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.fulfillmentText || "No response");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while processing the query");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
        />
        <button type="submit">Send</button>
      </form>
      {response && <p>Response: {response}</p>}
    </div>
  );
}
