import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { fetchChat } from "@/hooks/tanstack/fetchChat";
import { useMutation } from "@tanstack/react-query";

interface Dish {
  name: string;
  price: number;
  short_description: string;
  attributes: string[];
}

interface ChatResponse {
  dishes: Dish[];
  total_results: number;
  message: string;
}

interface SmartOrderProps {
  restaurantId: string;
  locationId: string;
  isChatLoading: boolean;
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        sender: "user" | "bot";
        text: string;
      }[]
    >
  >;
  setIsChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SmartOrdersChat = (props: SmartOrderProps) => {
  const {
    locationId,
    setMessages,
    isChatLoading,
    setIsChatLoading,
  } = props;
  const [chatInput, setChatInput] = useState("");
  const mutation = useMutation({
    mutationFn: () => fetchChat( locationId, chatInput),
    onSuccess: (data) => {
      setIsChatLoading(false);
      setChatInput("");
      
      try {
        // Try to parse as JSON first
        const content = data[0].content;
        let parsedContent: ChatResponse;
        
        try {
          parsedContent = JSON.parse(content);
          const { dishes, message } = parsedContent;
          
          // Add the natural language message
          setMessages((prev) => [...prev, { text: message, sender: "bot" }]);

          // If there are dishes, add them as cards
          if (dishes && dishes.length > 0) {
            dishes.forEach((dish: Dish) => {
              const cardMessage = JSON.stringify({
                type: "card",
                content: {
                  title: dish.name,
                  price: dish.price,
                  description: dish.short_description,
                  attributes: dish.attributes,
                },
              });
              setMessages((prev) => [...prev, { text: cardMessage, sender: "bot" }]);
            });
          }
        } catch {
          // If content is not JSON, treat it as a plain string message
          setMessages((prev) => [...prev, { text: content, sender: "bot" }]);
        }
      } catch (error) {
        console.error("Error processing response:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Error processing the server response.", sender: "bot" },
        ]);
      }
    },
    onError: (error) => {
      console.log("Getting Here");
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error communicating with the server.", sender: "bot" },
      ]); // Handle error
    },
  });

  const handleChatSend = () => {
    if (chatInput.trim() !== "") {
      setMessages((prev) => [...prev, { text: chatInput, sender: "user" }]);
      setIsChatLoading(true);
      mutation.mutate();
    }
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
