import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import axios from "axios"; // Make sure to install axios if you haven't already
import { Button } from "@/components/ui/button";
//Components
import ShoppingCardbutton from "../smartOrders/ShoppingCardbutton";
import ShoppingCardModal from "../smartOrders/ShoppingCardModal";
import SmartOrderSearchBar from "../smartOrders/SmartOrderSearchBar";
import SmartOrderCarousel from "../smartOrders/SmartOrderCarousel";
import SmartOrderTabs from "../smartOrders/SmartOrderTabs";

export interface MenuItem {
  name: string;
  short_description: string;
  price: number;
  image: string;
  course_type: string;
  // Add other fields as needed
}

export interface OrderItem extends MenuItem {
  quantity: number;
}
export interface AdminDashboardProps {
  menu: MenuItem[];
}

const AdminDashboard = (props: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemAmounts, setItemAmounts] = useState<{ [key: string]: number }>({});
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  // You'll need to provide these IDs from your application state or props
  const restaurantId = "665239a9f25b93e429b870bc";
  const locationId = "66523d74f25b93e429b870be";

  useEffect(() => {
    const filtered = props.menu.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.short_description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    setMessages((prev) => [...prev, { text: chatInput, sender: "user" }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/menu/rag/${restaurantId}/${locationId}/1/${chatInput}`
      );
      const { validation, recommendation } = response.data;
      console.log(response.data);
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
      setIsChatLoading(false);
    }
  };

  const addToOrderWithAmount = (item: MenuItem) => {
    const amount = itemAmounts[item.name] || 0;
    if (amount > 0) {
      setOrder((prevOrder) => {
        const existingItem = prevOrder.find(
          (orderItem) => orderItem.name === item.name
        );
        if (existingItem) {
          return prevOrder.map((orderItem) =>
            orderItem.name === item.name
              ? { ...orderItem, quantity: orderItem.quantity + amount }
              : orderItem
          );
        } else {
          return [...prevOrder, { ...item, quantity: amount }];
        }
      });
      // Reset the amount after adding to order
      setItemAmounts((prev) => ({ ...prev, [item.name]: 0 }));
    }
  };

  const renderMessage = (msg: { text: string; sender: "user" | "bot" }) => {
    if (msg.sender === "user") {
      return (
        <div className="flex justify-end mb-2">
          <div className="message user p-3 rounded-lg bg-blue-600 text-white max-w-[80%]">
            {msg.text}
          </div>
        </div>
      );
    }

    try {
      const parsedMessage = JSON.parse(msg.text);
      if (parsedMessage.type === "card") {
        const { title, price, description, attributes } = parsedMessage.content;
        const menuItem: MenuItem = {
          name: title,
          short_description: description,
          price: parseFloat(price),
          image: "", // You might want to add an image field if available
          course_type: "",
        };
        return (
          <div className="flex justify-start mb-2 bg-gray-900">
            <Card className="message bot bg-gray-800 text-white max-w-[80%]">
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
                <Button
                  className="w-full mt-2 bg-green-500 hover:bg-green-600 text-gray-900 font-semibold"
                  onClick={() => addToOrderWithAmount(menuItem)}
                >
                  Agregar a la orden
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }
    } catch (error) {
      // If parsing fails, it's a regular text message
    }

    return (
      <div className="flex justify-start mb-2">
        <div className="message bot p-3 rounded-lg bg-gray-700 text-white max-w-[80%]">
          {msg.text}
        </div>
      </div>
    );
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsMessageVisible(false);
  };
  //Container Starts Here
  return (
    <div className="container mx-auto py-4 px-4 relative darkBackground2 min-h-screen">
      {/* Shopping Cart Button */}
      <ShoppingCardbutton
        order={order}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />
      {/* Shopping Cart Modal */}
      {isCartOpen && <ShoppingCardModal order={order} />}

      {/* Search Bar */}
      <SmartOrderSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Carousel component */}
      <SmartOrderCarousel />

      {/* Menu Tabs */}
      <h1 className="text-3xl mb-4 font-light text-center text-white">
        Explore Our Menu
      </h1>
      <SmartOrderTabs
        filteredItems={filteredItems}
        itemAmounts={itemAmounts}
        setItemAmounts={setItemAmounts}
        addToOrderWithAmount={addToOrderWithAmount}
      />

      {/* Chat bot toggle button */}
      <div
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors group"
        onClick={toggleChat}
      >
        <Bot size={32} />
        {isMessageVisible && !isChatOpen && (
          <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
            Soy Sabina, tu asistente AI. ¿En qué puedo ayudarte?
            <div className="absolute bottom-0 right-4 w-2 h-2 bg-gray-800 transform rotate-45 translate-y-1/2"></div>
          </div>
        )}
      </div>

      {/* Chat interface */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="bg-gray-800 text-white p-3 font-bold flex justify-between items-center">
            <span>Sabina - Tu asistente AI</span>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-white"
            >
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
                    <span className="dot animate-bounce animation-delay-200">
                      .
                    </span>
                    <span className="dot animate-bounce animation-delay-400">
                      .
                    </span>
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
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
