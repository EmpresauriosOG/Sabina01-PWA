import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Send } from "lucide-react";
import axios from "axios";

interface MenuChatBotProps {
  restaurantId: string;
  locationId: string;
}

type ChatMessage = { sender: "user" | "bot"; text: string };

export default function MenuChatBot({
  restaurantId,
  locationId,
}: MenuChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMessageVisible(false);
  };

  const handleSend = async () => {
    if (!chatInput.trim() || isLoading) return;

    setMessages((prev) => [...prev, { text: chatInput, sender: "user" }]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `https:///menu/rag/${restaurantId}/${locationId}/1/${chatInput}`
      );
      const { validation, recommendation } = response.data;
      let botMessage: string | undefined;
      if (validation === 0) {
        botMessage = recommendation;
      } else if (validation === 1) {
        const { nombre_platillo, precio, descripcion, atributos } =
          JSON.parse(recommendation);
        botMessage = JSON.stringify({
          type: "card",
          content: {
            title: nombre_platillo,
            price: precio,
            description: descripcion,
            attributes: atributos,
          },
        });
      }
      if (typeof botMessage === "string") {
        setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error communicating with the server.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
        const { title, price, description, attributes } = parsed.content;
        return (
          <div className="flex justify-start mb-2">
            <Card className="bg-gray-800 text-white max-w-[80%]">
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
                      className="px-2 py-1 rounded-full text-xs font-semibold bg-[#70B7FF] text-gray-800"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
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
    <>
      <div
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors group"
        onClick={toggleChat}
      >
        <Bot size={32} />
        {isMessageVisible && !isOpen && (
          <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
            Soy Sabina, tu asistente AI
            <div className="absolute bottom-0 right-4 w-2 h-2 bg-gray-800 transform rotate-45 translate-y-1/2" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="bg-gray-800 text-white p-3 font-bold flex justify-between items-center">
            <span>Sabina - Asistente AI</span>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-white"
            >
              x
            </button>
          </div>
          <div
            className="flex-grow overflow-y-auto p-4 bg-gray-900"
            style={{ maxHeight: "400px" }}
          >
            {messages.map((msg, index) => (
              <React.Fragment key={index}>{renderMessage(msg)}</React.Fragment>
            ))}
            {isLoading && (
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
          <div className="p-3 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center">
              <Input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Pregunta sobre el menu..."
                disabled={isLoading}
                className="flex-grow mr-2 bg-gray-700 text-white border-gray-600 rounded-full"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-full p-2"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
