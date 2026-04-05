import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SmartOrdersChat from "./SmartOrdersChat";
import { MenuItem } from "./types";

interface ChatInterfaceProps {
  toggleChat: () => void;
  restaurantId: string;
  locationId: string;
  onAddToOrder: (item: MenuItem) => void;
}

type ChatMessage = { sender: "user" | "bot"; text: string };

const ChatInterface = ({
  toggleChat,
  restaurantId,
  locationId,
  onAddToOrder,
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (msg: ChatMessage) => {
    if (msg.sender === "user") {
      return (
        <div className="flex justify-end mb-2">
          <div className="p-3 rounded-lg bg-blue-600 text-white max-w-[80%]">
            {msg.text}
          </div>
        </div>
      );
    }

    try {
      const parsed = JSON.parse(msg.text);
      if (parsed.type === "card") {
        const { title, price, description, attributes, id, isActive } =
          parsed.content;
        const menuItem: MenuItem = {
          name: title,
          short_description: description,
          price: parseFloat(price),
          image: "",
          course_type: "",
          id: id ?? "",
          isActive: isActive ?? 1,
        };
        return (
          <div className="flex justify-start mb-2 dark:bg-neutral-900">
            <Card className="dark:bg-neutral-900 text-white max-w-[80%]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">{description}</p>
                <p className="font-bold mb-2 text-blue-400">${price}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {attributes.map((attr: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full mt-2 dark:bg-neutral-900 hover:bg-green-200 text-gray-900 font-semibold"
                  onClick={() => onAddToOrder(menuItem)}
                >
                  Agregar a la orden
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }
    } catch {
      // Regular text message
    }

    return (
      <div className="flex justify-start mb-2">
        <div className="p-3 rounded-lg bg-gray-700 text-white max-w-[80%]">
          {msg.text}
        </div>
      </div>
    );
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
            <div className="p-3 rounded-lg bg-gray-700 text-white">
              <div className="flex">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce animation-delay-200">.</span>
                <span className="animate-bounce animation-delay-400">.</span>
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
