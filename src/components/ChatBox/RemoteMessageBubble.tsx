import { useRemotePeer } from "@huddle01/react/hooks";

type TMessage = {
  text: string;
  sender: string;
};

type TPeerMetadata = {
  displayName: string;
};

interface Props {
  message: TMessage;
}

function RemoteMessageBubble({ message }: Props) {
  const { metadata } = useRemotePeer<TPeerMetadata>({ peerId: message.sender });

  return (
    <div className="flex flex-col items-start">
      <span className="bg-gray-500 text-white">{metadata?.displayName}</span>
      <span className="text-sm text-white">{message.text}</span>
    </div>
  );
}

export default RemoteMessageBubble;
