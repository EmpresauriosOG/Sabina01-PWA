import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Input } from "@/components/ui/input";
import {
  Search,
  Minus,
  Plus,
  Utensils,
  Salad,
  Ham,
  CakeSlice,
  GlassWater,
  Bot,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenu } from "@/hooks/tanstack/getMenu";
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { ShoppingCart } from "lucide-react";

interface MenuItem {
  _id: string;
  restaurant_id: string;
  location_id: string;
  name: string;
  short_description: string;
  long_description: string;
  price: number;
  image: string;
  ingredients: Array<{
    ingredient_id: string;
    quantity: number;
  }>;
  attributes: string[];
  course_type: string;
  meal_type: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

export default function Menu() {
  const { data, isLoading, isError } = useMenu("665239a9f25b93e429b870bc","66523d74f25b93e429b870be");
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemAmounts, setItemAmounts] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);

  console.log("Menu data:", data);
  console.log("Is loading:", isLoading);
  console.log("Is error:", isError);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = data.filter((item: MenuItem) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.attributes.some(attr => attr.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMenuItems(filtered);
    } else {
      setFilteredMenuItems([]);
    }
  }, [searchTerm, data]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsMessageVisible(false);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    setMessages((prev) => [...prev, { text: chatInput, sender: 'user' }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await axios.post(`https:///menu/rag/665239a9f25b93e429b870bc/66523d74f25b93e429b870be/1/${chatInput}`);
      const { validation, recommendation } = response.data;
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
                  onClick={() => {
                    // Implement add to order functionality here
                  }}
                >
                  Add to order
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

  const updateOrderQuantity = (itemName: string, newQuantity: number) => {
    setOrder(prevOrder => {
      if (newQuantity <= 0) {
        return prevOrder.filter(item => item.name !== itemName);
      }
      return prevOrder.map(item =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error loading menu data</h1>;
  }



  console.log(data);

  const promos = [
    {
      image: "https://media-cdn.tripadvisor.com/media/photo-s/18/f9/75/76/la-promocion-de-comida.jpg",
      alt: "Food promotion"
    },
    {
      image: "https://images.squarespace-cdn.com/content/v1/63cecb343c41c329a4aed5da/d4b732cf-a7fb-4a50-9769-47a701f74f62/Banner-Web--taquear-chingon.jpg",
      alt: "Taco promotion"
    },
  ];

  return (
    <div className="py-7 px-14 relative bg-gray-900 min-h-screen">
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
                <div key={index} className="flex justify-between items-center mb-4 text-white">
                  <div className="flex-grow">
                    <p>{item.name}</p>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateOrderQuantity(item.name, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateOrderQuantity(item.name, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={() => updateOrderQuantity(item.name, 0)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
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

      <div className="mb-8">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {promos.map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="bg-gray-800 border-none">
                    <CardContent className="flex aspect-[16/9] items-center justify-center p-0">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <h1 className="text-3xl mb-4 font-light text-center text-white">Explora nuestro menú</h1>
      <div className="relative w-full mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busca en el menú..."
          className="pl-10 py-2 bg-background text-foreground border-input focus:border-primary rounded-full w-full"
        />
      </div>
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-1 md:grid-cols-5 h-max">
          <TabsTrigger className="flex gap-2" value="all">
            <Utensils className="w-4 h-4" />
            Todos
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="bebidas">
            <GlassWater className="w-4 h-4" />
            Bebidas
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="entradas">
            <Salad className="w-4 h-4" />
            Entradas
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="platosfuertes">
            <Ham className="w-4 h-4" />
            Platos fuertes
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="postres">
            <CakeSlice className="w-4 h-4" />
            Postres
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item) => (
              <Card key={item._id} className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    className="rounded-lg aspect-video mb-2"
                    src={item.image}
                    alt={item.name}
                  />
                  <p className="font-light text-base">{item.short_description}</p>
                  <p className="font-bold mt-2 text-blue-400">${item.price.toFixed(2)}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.attributes.map((attribute, index) => (
                      <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6F61] text-white">
                        {attribute}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch space-y-2">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
                      disabled={!itemAmounts[item.name]}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold">{itemAmounts[item.name] || 0}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => addToOrderWithAmount(item)}
                    disabled={!itemAmounts[item.name]}
                  >
                    Add To Order
                  </Button>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="secondary" className="w-full">More Info</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>{item.name}</DrawerTitle>
                        <DrawerDescription className="">
                          <div className="space-y-5">
                            <p className="text-left text-base">
                              {item.long_description}
                            </p>
                            <p className="text-base text-left font-light">
                              Atributos
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.attributes.map((attribute, index) => (
                                <span key={index} className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FF6F61] text-white">
                                  {attribute}
                                </span>
                              ))}
                            </div>
                          </div>
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        {/* Order Amount */}
                        <div className="flex justify-center pb-5">
                          <div className="flex items-center justify-between w-56">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-full"
                              onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
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
                              onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                            >
                              <Plus className="h-4 w-4" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                        <Button onClick={() => addToOrderWithAmount(item)}>Add To Order</Button>
                        <DrawerClose>
                          <Button className="w-full" variant="outline">
                            Close
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bebidas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems
              .filter((item) => item.course_type === "Drink")
              .map((item) => (
                <Card key={item._id} className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{item.course_type}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      className="rounded-lg aspect-video mb-2"
                      src={item.image}
                      alt={item.name}
                    />
                    <p className="font-light text-base">{item.short_description}</p>
                    <p className="font-bold mt-2 text-blue-400">${item.price.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.attributes.map((attribute, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6F61] text-white">
                          {attribute}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
                        disabled={!itemAmounts[item.name]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold">{itemAmounts[item.name] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => addToOrderWithAmount(item)}
                      disabled={!itemAmounts[item.name]}
                    >
                      Add To Order
                    </Button>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="secondary" className="w-full">More Info</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{item.name}</DrawerTitle>
                          <DrawerDescription className="">
                            <div className="space-y-5">
                              <p className="text-left text-base">
                                {item.long_description}
                              </p>
                              <p className="text-base text-left font-light">
                                Atributos
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.attributes.map((attribute, index) => (
                                  <span key={index} className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FF6F61] text-white">
                                    {attribute}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                          {/* Order Amount */}
                          <div className="flex justify-center pb-5">
                            <div className="flex items-center justify-between w-56">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
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
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase</span>
                              </Button>
                            </div>
                          </div>
                          <Button onClick={() => addToOrderWithAmount(item)}>Add To Order</Button>
                          <DrawerClose>
                            <Button className="w-full" variant="outline">
                              Close
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="entradas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems
              .filter((item) => item.course_type === "Entrada")
              .map((item) => (
                <Card key={item._id} className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{item.course_type}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      className="rounded-lg aspect-video mb-2"
                      src={item.image}
                      alt={item.name}
                    />
                    <p className="font-light text-base">{item.short_description}</p>
                    <p className="font-bold mt-2 text-blue-400">${item.price.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.attributes.map((attribute, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6F61] text-white">
                          {attribute}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
                        disabled={!itemAmounts[item.name]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold">{itemAmounts[item.name] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => addToOrderWithAmount(item)}
                      disabled={!itemAmounts[item.name]}
                    >
                      Add To Order
                    </Button>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="secondary" className="w-full">More Info</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{item.name}</DrawerTitle>
                          <DrawerDescription className="">
                            <div className="space-y-5">
                              <p className="text-left text-base">
                                {item.long_description}
                              </p>
                              <p className="text-base text-left font-light">
                                Atributos
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.attributes.map((attribute, index) => (
                                  <span key={index} className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FF6F61] text-white">
                                    {attribute}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                          {/* Order Amount */}
                          <div className="flex justify-center pb-5">
                            <div className="flex items-center justify-between w-56">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
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
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase</span>
                              </Button>
                            </div>
                          </div>
                          <Button onClick={() => addToOrderWithAmount(item)}>Add To Order</Button>
                          <DrawerClose>
                            <Button className="w-full" variant="outline">
                              Close
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="platosfuertes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems
              .filter((item) => item.course_type === "Main Course")
              .map((item) => (
                <Card key={item._id} className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{item.course_type}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      className="rounded-lg aspect-video mb-2"
                      src={item.image}
                      alt={item.name}
                    />
                    <p className="font-light text-base">{item.short_description}</p>
                    <p className="font-bold mt-2 text-blue-400">${item.price.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.attributes.map((attribute, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6F61] text-white">
                          {attribute}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
                        disabled={!itemAmounts[item.name]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold">{itemAmounts[item.name] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => addToOrderWithAmount(item)}
                      disabled={!itemAmounts[item.name]}
                    >
                      Add To Order
                    </Button>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="secondary" className="w-full">More Info</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{item.name}</DrawerTitle>
                          <DrawerDescription className="">
                            <div className="space-y-5">
                              <p className="text-left text-base">
                                {item.long_description}
                              </p>
                              <p className="text-base text-left font-light">
                                Atributos
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.attributes.map((attribute, index) => (
                                  <span key={index} className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FF6F61] text-white">
                                    {attribute}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                          {/* Order Amount */}
                          <div className="flex justify-center pb-5">
                            <div className="flex items-center justify-between w-56">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
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
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase</span>
                              </Button>
                            </div>
                          </div>
                          <Button onClick={() => addToOrderWithAmount(item)}>Add To Order</Button>
                          <DrawerClose>
                            <Button className="w-full" variant="outline">
                              Close
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="postres">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems
              .filter((item) => item.course_type === "Postre")
              .map((item) => (
                <Card key={item._id} className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{item.course_type}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      className="rounded-lg aspect-video mb-2"
                      src={item.image}
                      alt={item.name}
                    />
                    <p className="font-light text-base">{item.short_description}</p>
                    <p className="font-bold mt-2 text-blue-400">${item.price.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.attributes.map((attribute, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6F61] text-white">
                          {attribute}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
                        disabled={!itemAmounts[item.name]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold">{itemAmounts[item.name] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => addToOrderWithAmount(item)}
                      disabled={!itemAmounts[item.name]}
                    >
                      Add To Order
                    </Button>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="secondary" className="w-full">More Info</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{item.name}</DrawerTitle>
                          <DrawerDescription className="">
                            <div className="space-y-5">
                              <p className="text-left text-base">
                                {item.long_description}
                              </p>
                              <p className="text-base text-left font-light">
                                Atributos
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.attributes.map((attribute, index) => (
                                  <span key={index} className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FF6F61] text-white">
                                    {attribute}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                          {/* Order Amount */}
                          <div className="flex justify-center pb-5">
                            <div className="flex items-center justify-between w-56">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1) }))}
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
                                onClick={() => setItemAmounts(prev => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }))}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase</span>
                              </Button>
                            </div>
                          </div>
                          <Button onClick={() => addToOrderWithAmount(item)}>Add To Order</Button>
                          <DrawerClose>
                            <Button className="w-full" variant="outline">
                              Close
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat bot toggle button */}
      <div 
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors group"
        onClick={toggleChat}
      >
        <Bot size={32} />
        {isMessageVisible && !isChatOpen && (
          <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
            I'm Sabina, your AI assistant. How can I help you?
            <div className="absolute bottom-0 right-4 w-2 h-2 bg-gray-800 transform rotate-45 translate-y-1/2"></div>
          </div>
        )}
      </div>

      {/* Chat interface */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="bg-gray-800 text-white p-3 font-bold flex justify-between items-center">
            <span>Sabina - Your AI Assistant</span>
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
                placeholder="Ask about the menu..."
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
}