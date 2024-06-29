import { useLocalPeer } from "@huddle01/react/hooks";

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

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<TPeerMetadata>();

  return (
    <div className="flex w-full flex-col items-end rounded-lg">
      <span className="text-sm text-white">{message.text}</span>
    </div>
  );
}

export default LocalMessageBubble;
