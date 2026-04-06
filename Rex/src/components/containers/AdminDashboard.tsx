import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import ShoppingCardbutton from "../smartOrders/ShoppingCardbutton";
import ShoppingCardModal from "../smartOrders/ShoppingCardModal";
import SmartOrderSearchBar from "../smartOrders/SmartOrderSearchBar";
import SmartOrderCarousel from "../smartOrders/SmartOrderCarousel";
import SmartOrderTabs from "../smartOrders/SmartOrderTabs";
import ChatInterface from "../smartOrders/ChatInterface";
import { MenuItem, OrderItem } from "../smartOrders/types";

export type { MenuItem, OrderItem };

export interface AdminDashboardProps {
  menu: MenuItem[];
}

const AdminDashboard = ({ menu }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemAmounts, setItemAmounts] = useState<Record<string, number>>({});

  // TODO [D4]: HARDCODED test restaurant/location IDs — should come from useUserStore().user
  // Previously hardcoded: restaurantId = "665239a9f25b93e429b870bc", locationId = "66523d74f25b93e429b870be"
  const restaurantId = "665239a9f25b93e429b870bc";
  const locationId = "66523d74f25b93e429b870be";

  useEffect(() => {
    const filtered = menu.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.short_description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, menu]);

  // --- Cart handlers ---

  const addToOrderWithAmount = (item: MenuItem) => {
    const amount = itemAmounts[item.name] || 0;
    if (amount <= 0) return;
    setOrder((prev) => {
      const existing = prev.find((o) => o.id === item.id);
      if (existing) {
        return prev.map((o) =>
          o.id === item.id ? { ...o, quantity: o.quantity + amount } : o
        );
      }
      return [...prev, { ...item, quantity: amount }];
    });
    setItemAmounts((prev) => ({ ...prev, [item.name]: 0 }));
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setOrder((prev) => {
      if (quantity < 1) return prev;
      return prev.map((item, i) => (i === index ? { ...item, quantity } : item));
    });
  };

  const handleRemoveItem = (index: number) => {
    setOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDiscardCart = () => setOrder([]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
    setIsMessageVisible(false);
  };

  return (
    <div className="container mx-auto py-4 px-4 relative darkBackground2 min-h-screen">
      <ShoppingCardbutton
        order={order}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />

      {isCartOpen && (
        <ShoppingCardModal
          order={order}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onDiscardCart={handleDiscardCart}
        />
      )}

      <SmartOrderCarousel />

      <h1 className="mb-4 font-light text-center">
        Explora nuestro Menu o preguntale al Bot por Sugerencias!
      </h1>

      <SmartOrderSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <SmartOrderTabs
        filteredItems={filteredItems}
        itemAmounts={itemAmounts}
        setItemAmounts={setItemAmounts}
        addToOrderWithAmount={addToOrderWithAmount}
      />

      {/* Chat toggle button */}
      <div
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors group"
        onClick={toggleChat}
      >
        <Bot size={32} />
        {isMessageVisible && !isChatOpen && (
          <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
            Soy Sabina, tu asistente AI. ¿En qué puedo ayudarte?
            <div className="absolute bottom-0 right-4 w-2 h-2 bg-gray-800 transform rotate-45 translate-y-1/2" />
          </div>
        )}
      </div>

      {isChatOpen && (
        <ChatInterface
          restaurantId={restaurantId}
          locationId={locationId}
          onAddToOrder={addToOrderWithAmount}
          toggleChat={toggleChat}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
