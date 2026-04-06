import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useChat, ChatMessage } from "@/hooks/tanstack/useChat";

interface SmartOrderProps {
  restaurantId: string;
  locationId: string;
  isChatLoading: boolean;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SmartOrdersChat = (props: SmartOrderProps) => {
  const { locationId, setMessages, isChatLoading, setIsChatLoading } = props;
  const [chatInput, setChatInput] = useState("");

  const { send } = useChat(locationId, {
    onMessages: (messages) => {
      setMessages((prev) => [...prev, ...messages]);
      setIsChatLoading(false);
    },
  });

  const handleChatSend = () => {
    if (chatInput.trim() === "") return;
    setMessages((prev) => [...prev, { text: chatInput, sender: "user" }]);
    setIsChatLoading(true);
    send(chatInput);
    setChatInput("");
  };

  return (
    <div className="p-3 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center">
        <Input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
          placeholder="Pregunta sobre el menú..."
          disabled={isChatLoading}
          className="flex-grow mr-2 bg-gray-700 text-white border-gray-600 rounded-full"
        />
        <Button
          onClick={handleChatSend}
          disabled={isChatLoading}
          className="bg-blue-600 text-white hover:bg-blue-700 rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default SmartOrdersChat;
