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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenu } from "@/hooks/tanstack/getMenu";
import { menuData } from "@/shared/constants";
import { useState, useRef, useEffect } from "react";
import axios from 'axios';

export default function Menu() {
  const { data, isLoading, isError } = useMenu("665239a9f25b93e429b870bc");

  if (isLoading) {
    <h1>Im cumming</h1>;
  }

  if (isError) {
    <h1>Error</h1>;
  }

  console.log(data);

  const promos = [
    {
      image:
        "https://media-cdn.tripadvisor.com/media/photo-s/18/f9/75/76/la-promocion-de-comida.jpg",
    },
    {
      image:
        "https://images.squarespace-cdn.com/content/v1/63cecb343c41c329a4aed5da/d4b732cf-a7fb-4a50-9769-47a701f74f62/Banner-Web--taquear-chingon.jpg",
    },
  ];

  const [amount, setAmount] = React.useState(0);

  function add() {
    setAmount(amount + 1);
  }

  function substract() {
    setAmount(amount - 1);
  }

  // Add new state for chat functionality
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add useEffect for scrolling to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuData);

  useEffect(() => {
    const filtered = menuData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMenuItems(filtered);
  }, [searchTerm]);

  return (
    <div className="py-7 px-14 relative">
      <div className="h-full flex justify-center mb-8">
        <Carousel className="w-full h-[12rem] md:h-[20rem] lg:h-[25rem] -z-10">
          <CarouselContent>
            {promos.map((item, index) => (
              <CarouselItem key={index} className="">
                <div className="flex items-center justify-center p-4">
                  <img
                    className="rounded-lg h-[12rem] md:h-[20rem] lg:h-[25rem]"
                    src={item.image}
                    alt=""
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <h1 className="text-3xl mb-4 font-light text-center">Explore Our Menu</h1>
      <div className="relative w-full mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search menu items..."
          className="pl-10 py-2 bg-background text-foreground border-input focus:border-primary rounded-full w-full"
        />
      </div>
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-1 md:grid-cols-5 h-max">
          <TabsTrigger className="flex gap-2" value="all">
            <Utensils className="w-4 h-4" />
            All
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="drinks">
            <GlassWater className="w-4 h-4" />
            Drinks
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="appetizers">
            <Salad className="w-4 h-4" />
            Appetizers
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="main courses">
            <Ham className="w-4 h-4" />
            Main Courses
          </TabsTrigger>
          <TabsTrigger className="flex gap-2" value="desserts">
            <CakeSlice className="w-4 h-4" />
            Desserts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="flex flex-col gap-8">
            {/* Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <Card>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{item.category}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      className="rounded-lg aspect-video mb-2"
                      src={item.image}
                    />
                    <p className="font-light text-base">
                      {item.shortDescription}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Add To Order</Button>
                    <Drawer>
                      <DrawerTrigger>
                        <Button variant="secondary">More Info</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>
                            {item.name} ({item.totalKcals} kcal)
                          </DrawerTitle>
                          <DrawerDescription className="">
                            <div className="space-y-5">
                              <p className="text-left text-base">
                                {item.longDescription}
                              </p>
                              <p className="text-base text-left font-light">
                                Ingredients
                              </p>
                              <ul className="text-left list-disc list-inside font-thin">
                                {item.ingredients.map((ingredient) => (
                                  <li>
                                    <span>
                                      {ingredient.name} ({ingredient.kcal} kcal)
                                    </span>
                                  </li>
                                ))}
                              </ul>
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
                                onClick={substract}
                                disabled={amount <= 0}
                              >
                                <Minus className="h-4 w-4" />
                                <span className="sr-only">Decrease</span>
                              </Button>
                              <div className="text-center">
                                <div className="text-xl font-bold tracking-tighter">
                                  {amount}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={add}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase</span>
                              </Button>
                            </div>
                          </div>
                          <Button>Add To Order</Button>
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
          </div>
        </TabsContent>
        <TabsContent value="drinks">
          {/* Menu */}
          <div className="flex flex-col gap-8">
            {/* Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems
                .filter((item) => item.category === "Drink")
                .map((item) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{item.category}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        className="rounded-lg aspect-video mb-2"
                        src={item.image}
                        alt=""
                      />
                      <p className="font-light text-base">
                        {item.shortDescription}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button>Add To Order</Button>
                      <Drawer>
                        <DrawerTrigger>
                          <Button variant="secondary">More Info</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>
                              {item.name} ({item.totalKcals} kcal)
                            </DrawerTitle>
                            <DrawerDescription>
                              <div className="space-y-5">
                                <p className="text-left text-base">
                                  {item.longDescription}
                                </p>
                                <p className="text-base text-left font-light">
                                  Ingredients
                                </p>
                                <ul className="text-left list-disc list-inside font-thin">
                                  {item.ingredients.map((ingredient) => (
                                    <li>
                                      <span>
                                        {ingredient.name} ({ingredient.kcal}{" "}
                                        kcal)
                                      </span>
                                    </li>
                                  ))}
                                </ul>
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
                                  onClick={substract}
                                  disabled={amount <= 0}
                                >
                                  <Minus className="h-4 w-4" />
                                  <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="text-center">
                                  <div className="text-xl font-bold tracking-tighter">
                                    {amount}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full"
                                  onClick={add}
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Increase</span>
                                </Button>
                              </div>
                            </div>
                            <Button>Add To Order</Button>
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
          </div>
        </TabsContent>
        <TabsContent value="appetizers">
          {/* Menu */}
          <div className="flex flex-col gap-8">
            {/* Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems
                .filter((item) => item.category === "Appetizer")
                .map((item) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{item.category}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        className="rounded-lg aspect-video mb-2"
                        src={item.image}
                        alt=""
                      />
                      <p className="font-light text-base">
                        {item.shortDescription}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button>Add To Order</Button>
                      <Drawer>
                        <DrawerTrigger>
                          <Button variant="secondary">More Info</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>
                              {item.name} ({item.totalKcals} kcal)
                            </DrawerTitle>
                            <DrawerDescription>
                              <div className="space-y-5">
                                <p className="text-left text-base">
                                  {item.longDescription}
                                </p>
                                <p className="text-base text-left font-light">
                                  Ingredients
                                </p>
                                <ul className="text-left list-disc list-inside font-thin">
                                  {item.ingredients.map((ingredient) => (
                                    <li>
                                      <span>
                                        {ingredient.name} ({ingredient.kcal}{" "}
                                        kcal)
                                      </span>
                                    </li>
                                  ))}
                                </ul>
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
                                  onClick={substract}
                                  disabled={amount <= 0}
                                >
                                  <Minus className="h-4 w-4" />
                                  <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="text-center">
                                  <div className="text-xl font-bold tracking-tighter">
                                    {amount}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full"
                                  onClick={add}
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Increase</span>
                                </Button>
                              </div>
                            </div>
                            <Button>Add To Order</Button>
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
          </div>
        </TabsContent>
        <TabsContent value="main courses">
          {/* Menu */}
          <div className="flex flex-col gap-8">
            {/* Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems
                .filter((item) => item.category === "Main Course")
                .map((item) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{item.category}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        className="rounded-lg aspect-video mb-2"
                        src={item.image}
                        alt=""
                      />
                      <p className="font-light text-base">
                        {item.shortDescription}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button>Add To Order</Button>
                      <Drawer>
                        <DrawerTrigger>
                          <Button variant="secondary">More Info</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>
                              {item.name} ({item.totalKcals} kcal)
                            </DrawerTitle>
                            <DrawerDescription>
                              <div className="space-y-5">
                                <p className="text-left text-base">
                                  {item.longDescription}
                                </p>
                                <p className="text-base text-left font-light">
                                  Ingredients
                                </p>
                                <ul className="text-left list-disc list-inside font-thin">
                                  {item.ingredients.map((ingredient) => (
                                    <li>
                                      <span>
                                        {ingredient.name} ({ingredient.kcal}{" "}
                                        kcal)
                                      </span>
                                    </li>
                                  ))}
                                </ul>
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
                                  onClick={substract}
                                  disabled={amount <= 0}
                                >
                                  <Minus className="h-4 w-4" />
                                  <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="text-center">
                                  <div className="text-xl font-bold tracking-tighter">
                                    {amount}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full"
                                  onClick={add}
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Increase</span>
                                </Button>
                              </div>
                            </div>
                            <Button>Add To Order</Button>
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
          </div>
        </TabsContent>
        <TabsContent value="desserts">
          {/* Menu */}
          <div className="flex flex-col gap-8">
            {/* Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems
                .filter((item) => item.category === "Dessert")
                .map((item) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{item.category}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        className="rounded-lg aspect-video mb-2"
                        src={item.image}
                        alt=""
                      />
                      <p className="font-light text-base">
                        {item.shortDescription}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button>Add To Order</Button>
                      <Drawer>
                        <DrawerTrigger>
                          <Button variant="secondary">More Info</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>
                              {item.name} ({item.totalKcals} kcal)
                            </DrawerTitle>
                            <DrawerDescription>
                              <div className="space-y-5">
                                <p className="text-left text-base">
                                  {item.longDescription}
                                </p>
                                <p className="text-base text-left font-light">
                                  Ingredients
                                </p>
                                <ul className="text-left list-disc list-inside font-thin">
                                  {item.ingredients.map((ingredient) => (
                                    <li>
                                      <span>
                                        {ingredient.name} ({ingredient.kcal}{" "}
                                        kcal)
                                      </span>
                                    </li>
                                  ))}
                                </ul>
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
                                  onClick={substract}
                                  disabled={amount <= 0}
                                >
                                  <Minus className="h-4 w-4" />
                                  <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="text-center">
                                  <div className="text-xl font-bold tracking-tighter">
                                    {amount}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full"
                                  onClick={add}
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Increase</span>
                                </Button>
                              </div>
                            </div>
                            <Button>Add To Order</Button>
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