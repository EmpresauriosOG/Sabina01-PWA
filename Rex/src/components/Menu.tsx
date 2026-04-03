import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Utensils,
  Salad,
  Ham,
  CakeSlice,
  GlassWater,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenu } from "@/hooks/tanstack/getMenu";
import { PageLoader } from "@/components/ui/loading";
import { MenuItem } from "./menu/MenuItemCard";
import MenuItemGrid from "./menu/MenuItemGrid";
import MenuCart, { OrderItem } from "./menu/MenuCart";
import MenuChatBot from "./menu/MenuChatBot";

const promos = [
  {
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/18/f9/75/76/la-promocion-de-comida.jpg",
    alt: "Food promotion",
  },
  {
    image:
      "https://images.squarespace-cdn.com/content/v1/63cecb343c41c329a4aed5da/d4b732cf-a7fb-4a50-9769-47a701f74f62/Banner-Web--taquear-chingon.jpg",
    alt: "Taco promotion",
  },
];

const categories = [
  { value: "all", label: "Todos", icon: Utensils },
  { value: "bebidas", label: "Bebidas", icon: GlassWater, courseType: "Drink" },
  { value: "entradas", label: "Entradas", icon: Salad, courseType: "Appetizer" },
  { value: "platosfuertes", label: "Platos fuertes", icon: Ham, courseType: "Main Course" },
  { value: "postres", label: "Postres", icon: CakeSlice, courseType: "Dessert" },
];

export default function Menu() {
  const { restaurantId, locationId } = useParams<{
    restaurantId: string;
    locationId: string;
  }>();
  // TODO [D2]: Remove test fallback IDs once route params are always provided
  // Previously hardcoded for testing: restaurantId = "665239a9f25b93e429b870bc", locationId = "66523d74f25b93e429b870be"
  const { data, isLoading, isError } = useMenu(
    restaurantId ?? "665239a9f25b93e429b870bc",
    locationId ?? "66523d74f25b93e429b870be"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemAmounts, setItemAmounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = data.filter(
        (item: MenuItem) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.short_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.attributes.some((attr) =>
            attr.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredMenuItems(filtered);
    } else {
      setFilteredMenuItems([]);
    }
  }, [searchTerm, data]);

  const handleAmountChange = (name: string, amount: number) => {
    setItemAmounts((prev) => ({ ...prev, [name]: amount }));
  };

  const addToOrderWithAmount = (item: MenuItem) => {
    const amount = itemAmounts[item.name] || 0;
    if (amount > 0) {
      setOrder((prev) => {
        const existing = prev.find((o) => o.name === item.name);
        if (existing) {
          return prev.map((o) =>
            o.name === item.name
              ? { ...o, quantity: o.quantity + amount }
              : o
          );
        }
        return [...prev, { ...item, quantity: amount }];
      });
      setItemAmounts((prev) => ({ ...prev, [item.name]: 0 }));
    }
  };

  const updateOrderQuantity = (name: string, quantity: number) => {
    setOrder((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.name !== name)
        : prev.map((item) =>
            item.name === name ? { ...item, quantity } : item
          )
    );
  };

  if (isLoading) {
    return <PageLoader message="Cargando menu" />;
  }

  if (isError) {
    return <h1>Error loading menu data</h1>;
  }

  return (
    <div className="py-7 px-14 relative bg-gray-900 min-h-screen">
      <MenuCart
        order={order}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen(!isCartOpen)}
        onUpdateQuantity={updateOrderQuantity}
      />

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

      <h1 className="text-3xl mb-4 font-light text-center text-white">
        Explora nuestro menu
      </h1>

      <div className="relative w-full mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busca en el menu..."
          className="pl-10 py-2 bg-background text-foreground border-input focus:border-primary rounded-full w-full"
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-1 md:grid-cols-5 h-max">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} className="flex gap-2" value={cat.value}>
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <MenuItemGrid
              items={filteredMenuItems}
              courseType={cat.courseType}
              itemAmounts={itemAmounts}
              onAmountChange={handleAmountChange}
              onAddToOrder={addToOrderWithAmount}
            />
          </TabsContent>
        ))}
      </Tabs>

      <MenuChatBot
        restaurantId={restaurantId ?? "665239a9f25b93e429b870bc"}
        locationId={locationId ?? "66523d74f25b93e429b870be"}
      />
    </div>
  );
}
