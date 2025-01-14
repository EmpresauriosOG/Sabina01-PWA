import React, { useEffect, useRef, useState } from "react";
import SmartOrdersChat from "./SmartOrdersChat";

interface ChatInterfaceProps {
  toggleChat: () => void;
  restaurantId: string;
  locationId: string;
  renderMessage: (msg: { text: string; sender: "user" | "bot" }) => JSX.Element;
}

const ChatInterface = (props: ChatInterfaceProps) => {
  const { toggleChat, restaurantId, locationId, renderMessage } = props;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
      <div className="bg-gray-800 text-white p-3 font-bold flex justify-between items-center">
        <span>Sabina - Tu asistente AI</span>
        <button onClick={toggleChat} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-900"
        style={{ maxHeight: "400px" }}
      >
        {messages.map((msg, index) => (
          <React.Fragment key={index}>{renderMessage(msg)}</React.Fragment>
        ))}
        {isChatLoading && (
          <div className="flex justify-start mb-2">
            <div className="message bot p-3 rounded-lg bg-gray-700 text-white">
              <div className="typing-indicator flex">
                <span className="dot animate-bounce">.</span>
                <span className="dot animate-bounce animation-delay-200"></span>
                <span className="dot animate-bounce animation-delay-400">
                  .
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <SmartOrdersChat
        restaurantId={restaurantId}
        locationId={locationId}
        setMessages={setMessages}
        isChatLoading={isChatLoading}
        setIsChatLoading={setIsChatLoading}
      />
    </div>
  );
};

export default ChatInterface;
