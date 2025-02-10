import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
//Components
import ShoppingCardbutton from "../smartOrders/ShoppingCardbutton";
import ShoppingCardModal from "../smartOrders/ShoppingCardModal";
import SmartOrderSearchBar from "../smartOrders/SmartOrderSearchBar";
import SmartOrderCarousel from "../smartOrders/SmartOrderCarousel";
import SmartOrderTabs from "../smartOrders/SmartOrderTabs";
import ChatInterface from "../smartOrders/ChatInterface";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setOrder((prevOrder) => {
      if (quantity < 1) return prevOrder;
      return prevOrder.map((item, i) =>
        i === index ? { ...item, quantity } : item
      );
    });
  };

  const handleRemoveItem = (index: number) => {
    setOrder((prevOrder) => prevOrder.filter((_, i) => i !== index));
  };

  const handleDiscardCart = () => {
    setOrder([]);
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
          <div className="flex justify-start mb-2 dark:bg-neutral-900">
            <Card className="message bot dark:bg-neutral-900 text-white max-w-[80%]">
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
                      {attr} aaa
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full mt-2 dark:bg-neutral-900 hover:bg-green-200 text-gray-900 font-semibold"
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
      {isCartOpen && (
        <ShoppingCardModal
          order={order}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onDiscardCart={handleDiscardCart}
        />
      )}

      {/* Carousel component */}
      <SmartOrderCarousel />

      <h1 className="mb-4 font-light text-center">
        Explora nuestro Menu o preguntale al Bot por Sugerencias!
      </h1>

      {/* Search Bar */}
      <SmartOrderSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Menu Tabs */}

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
        <ChatInterface
          restaurantId={restaurantId}
          locationId={locationId}
          renderMessage={renderMessage}
          toggleChat={toggleChat}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
