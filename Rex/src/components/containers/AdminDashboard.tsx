import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Search, ShoppingCart, Bot, Utensils, Salad, CakeSlice, Plus, Minus } from "lucide-react";
import axios from 'axios'; // Make sure to install axios if you haven't already
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MenuItem {
  name: string;
  short_description: string;
  price: number;
  image: string;
  course_type: string;
  // Add other fields as needed
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const promos = [
  {
    image: "https://media-cdn.tripadvisor.com/media/photo-s/18/f9/75/76/la-promocion-de-comida.jpg",
  },
  {
    image: "https://images.squarespace-cdn.com/content/v1/63cecb343c41c329a4aed5da/d4b732cf-a7fb-4a50-9769-47a701f74f62/Banner-Web--taquear-chingon.jpg",
  },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCourseType, setSelectedCourseType] = useState('all');
  const [itemAmounts, setItemAmounts] = useState<{[key: string]: number}>({});
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  // You'll need to provide these IDs from your application state or props
  const restaurantId = "665239a9f25b93e429b870bc";
  const locationId = "66523d74f25b93e429b870be";

  const uniqueCourseTypes = ['all', 'Entrada', 'Postre'];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/menu/${restaurantId}/${locationId}`);
        setMenuItems(response.data.menu);
        setFilteredItems(response.data.menu);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [restaurantId, locationId]);

  useEffect(() => {
    const filtered = menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.short_description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, menuItems]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    setMessages((prev) => [...prev, { text: chatInput, sender: 'user' }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/menu/rag/${restaurantId}/${locationId}/1/${chatInput}`);
      const { validation, recommendation } = response.data;
      console.log(response.data)
      let botMessage: string | undefined;
      if (validation === 0) {
        botMessage = recommendation;
      } else if (validation === 1) {
        const { nombre_platillo, precio, descripcion, atributos } = JSON.parse(recommendation);
        botMessage = JSON.stringify({
          type: 'card',
          content: {
            title: nombre_platillo,
            price: precio,
            description: descripcion,
            attributes: atributos
          }
        });
      }
      if (typeof botMessage === 'string') {
        setMessages((prev) => [...prev, { text: botMessage, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { text: 'Error communicating with the server.', sender: 'bot' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const addAmount = (itemName: string) => {
    setItemAmounts(prev => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1
    }));
  };

  const subtractAmount = (itemName: string) => {
    setItemAmounts(prev => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 0) - 1, 0)
    }));
  };

  const addToOrderWithAmount = (item: MenuItem) => {
    const amount = itemAmounts[item.name] || 0;
    if (amount > 0) {
      setOrder(prevOrder => {
        const existingItem = prevOrder.find(orderItem => orderItem.name === item.name);
        if (existingItem) {
          return prevOrder.map(orderItem =>
            orderItem.name === item.name
              ? { ...orderItem, quantity: orderItem.quantity + amount }
              : orderItem
          );
        } else {
          return [...prevOrder, { ...item, quantity: amount }];
        }
      });
      // Reset the amount after adding to order
      setItemAmounts(prev => ({ ...prev, [item.name]: 0 }));
    }
  };

  const renderMessage = (msg: { text: string; sender: 'user' | 'bot' }) => {
    if (msg.sender === 'user') {
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
      if (parsedMessage.type === 'card') {
        const { title, price, description, attributes } = parsedMessage.content;
        const menuItem: MenuItem = {
          name: title,
          short_description: description,
          price: parseFloat(price),
          image: '',// You might want to add an image field if available
          course_type: '', 
        };
        return (
          <div className="flex justify-start mb-2">
            <Card className="message bot bg-gray-800 text-white max-w-[80%]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">{description}</p>
                <p className="font-bold mb-2 text-blue-400">${price}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {attributes.map((attr: string, index: number) => (
                    <span key={index} className="px-2 py-1 rounded-full text-xs font-semibold bg-[#70B7FF] text-gray-800">
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

  const filteredAndTypedItems = filteredItems.filter(item => 
    selectedCourseType === 'all' || item.course_type === selectedCourseType
  );

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsMessageVisible(false);
  };

  return (
    <div className="container mx-auto py-4 px-4 relative bg-gray-900 min-h-screen">
      {/* Shopping Cart Button */}
      <div 
        className="fixed top-4 right-4 bg-blue-500 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors z-50"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <ShoppingCart size={24} />
        {order.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {order.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </div>

      {/* Shopping Cart Modal */}
      {isCartOpen && (
        <div className="fixed top-16 right-4 w-80 bg-gray-900 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="bg-gray-800 text-white p-3 font-bold">Your Order</div>
          <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {order.length === 0 ? (
              <p className="text-gray-400">Your cart is empty</p>
            ) : (
              order.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2 text-white">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
            {order.length > 0 && (
              <div className="mt-4 pt-2 border-t border-gray-700">
                <div className="flex justify-between items-center text-white font-bold">
                  <span>Total:</span>
                  <span>${order.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                <Button className="w-full mt-2 bg-green-500 hover:bg-green-600">
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative w-full mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search menu items..."
          className="pl-10 py-2 bg-gray-800 text-white border-gray-700 focus:border-blue-500 rounded-full w-full"
        />
      </div>

      {/* Carousel component */}
      <div className="relative mb-8">
        <Carousel className="w-full h-[12rem] md:h-[20rem] lg:h-[25rem]">
          <CarouselContent>
            {promos.map((item, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center p-4">
                  <img
                    className="rounded-lg h-[12rem] md:h-[20rem] lg:h-[25rem] w-full object-cover"
                    src={item.image}
                    alt={`Promo ${index + 1}`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <CarouselPrevious className="relative left-0 bg-white/30 hover:bg-white/50" />
            <CarouselNext className="relative right-0 bg-white/30 hover:bg-white/50" />
          </div>
        </Carousel>
      </div>

      {/* Menu Tabs */}
      <h1 className="text-3xl mb-4 font-light text-center text-white">Explore Our Menu</h1>
      <Tabs defaultValue="all" onValueChange={setSelectedCourseType}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 h-max mb-6">
          <TabsTrigger className="flex gap-2" value="all">
            <Utensils className="w-4 h-4" />
            All
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="Entrada">
            <Salad className="w-4 h-4" />
            Appetizers
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="Postre">
            <CakeSlice className="w-4 h-4" />
            Desserts
          </TabsTrigger>
        </TabsList>
        
        {uniqueCourseTypes.map((type) => (
          <TabsContent key={type} value={type} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndTypedItems.map((item) => (
              <Card key={item.name} className="bg-gray-800 text-white overflow-hidden flex flex-col h-full">
                <div className="relative h-48">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-2 flex-grow overflow-hidden line-clamp-3">{item.short_description}</p>
                  <p className="mt-auto font-bold text-blue-400">${item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 bg-gray-700">
                  <div className="w-full">
                    <div className="flex justify-center pb-3">
                      <div className="flex items-center justify-between w-full">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => subtractAmount(item.name)}
                          disabled={!itemAmounts[item.name]}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        <div className="text-center">
                          <div className="text-xl font-bold tracking-tighter">
                            {itemAmounts[item.name] || 0}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => addAmount(item.name)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-semibold"
                      onClick={() => addToOrderWithAmount(item)}
                      disabled={!itemAmounts[item.name]}
                    >
                      Agregar a la orden
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">
              ×
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 bg-gray-900" style={{maxHeight: "400px"}}>
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                {renderMessage(msg)}
              </React.Fragment>
            ))}
            {isChatLoading && (
              <div className="flex justify-start mb-2">
                <div className="message bot p-3 rounded-lg bg-gray-700 text-white">
                  <div className="typing-indicator flex">
                    <span className="dot animate-bounce">.</span>
                    <span className="dot animate-bounce animation-delay-200">.</span>
                    <span className="dot animate-bounce animation-delay-400">.</span>
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
                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Pregunta sobre el menú..."
                disabled={isChatLoading}
                className="flex-grow mr-2 bg-gray-700 text-white border-gray-600 rounded-full"
              />
              <Button onClick={handleChatSend} disabled={isChatLoading} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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