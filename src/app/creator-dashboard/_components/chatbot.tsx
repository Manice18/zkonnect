import React from "react";
// import "./df-messenger-default.css";

interface Props {
  projectId: string;
  agentId: string;
  languageCode: string;
  maxQueryLength: string;
}

const DialogFlowMessenger: React.FC<Props> = ({
  projectId,
  agentId,
  languageCode,
  maxQueryLength,
}) => {
  return (
    <div
      style={{
        zIndex: 999,
        position: "fixed",
        fontFamily: "Inter",
        fontSize: 14,
        bottom: 16,
        right: 16,
      }}
    >
      <div
        style={{
          backgroundColor: "#f3f6fc",
          padding: 16,
          borderRadius: 16,
        }}
      >
        <div
          style={{
            backgroundColor: "#d3e3fd",
            padding: 8,
            borderRadius: 8,
          }}
        >
          <span>Chat Title</span>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: 8,
            borderRadius: 8,
          }}
        >
          {/* Bot message will be rendered here */}
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => {
  return (
    <DialogFlowMessenger
      projectId="zkonnect"
      agentId="6baab077-51fe-40ee-9226-aed6272bbf56"
      languageCode="en"
      maxQueryLength="-1"
    />
  );
};

export default Chatbot;
