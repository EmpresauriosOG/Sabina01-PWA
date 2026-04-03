import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
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
import { Minus, Plus } from "lucide-react";

export interface MenuItem {
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

interface MenuItemCardProps {
  item: MenuItem;
  amount: number;
  onAmountChange: (name: string, amount: number) => void;
  onAddToOrder: (item: MenuItem) => void;
  showBadge?: boolean;
}

export default function MenuItemCard({
  item,
  amount,
  onAmountChange,
  onAddToOrder,
  showBadge = false,
}: MenuItemCardProps) {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        {showBadge && <Badge variant="outline">{item.course_type}</Badge>}
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
            <span
              key={index}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6F61] text-white"
            >
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
            onClick={() =>
              onAmountChange(item.name, Math.max(0, amount - 1))
            }
            disabled={!amount}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">{amount}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onAmountChange(item.name, amount + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="w-full"
          onClick={() => onAddToOrder(item)}
          disabled={!amount}
        >
          Agregar
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary" className="w-full">
              Mas info
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerDescription>
                <div className="space-y-5">
                  <p className="text-left text-base">{item.long_description}</p>
                  <p className="text-base text-left font-light">Atributos</p>
                  <div className="flex flex-wrap gap-2">
                    {item.attributes.map((attribute, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FF6F61] text-white"
                      >
                        {attribute}
                      </span>
                    ))}
                  </div>
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <div className="flex justify-center pb-5">
                <div className="flex items-center justify-between w-56">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() =>
                      onAmountChange(item.name, Math.max(0, amount - 1))
                    }
                    disabled={!amount}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="text-xl font-bold tracking-tighter">
                    {amount}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onAmountChange(item.name, amount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={() => onAddToOrder(item)}>Agregar</Button>
              <DrawerClose>
                <Button className="w-full" variant="outline">
                  Cerrar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
}
