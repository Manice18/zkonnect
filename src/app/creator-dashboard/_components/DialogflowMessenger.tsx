"use client";
import React, { useEffect } from "react";
import Link from "next/link";

const DialogflowMessenger: React.FC = () => {
  useEffect(() => {
    // Load Dialogflow Messenger script
    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Link
      rel="stylesheet"
      href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
    >
      <script src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"></script>
    </Link>
  );
};

export default DialogflowMessenger;
