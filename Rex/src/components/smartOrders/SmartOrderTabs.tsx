import { CakeSlice, Minus, Plus, Salad, Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { MenuItem } from "../containers/AdminDashboard";

interface SmartOrderTabsProps {
  filteredItems: MenuItem[];
  itemAmounts: { [key: string]: number };
  setItemAmounts: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  addToOrderWithAmount: (item: MenuItem) => void;
}

const SmartOrderTabs = (props: SmartOrderTabsProps) => {
  const { itemAmounts, setItemAmounts, addToOrderWithAmount } = props;
  const uniqueCourseTypes = ["all", "Entrada", "Postre"];
  const [selectedCourseType, setSelectedCourseType] = useState("all");
  const filteredAndTypedItems = props.filteredItems.filter(
    (item) =>
      selectedCourseType === "all" || item.course_type === selectedCourseType
  );

  const addAmount = (itemName: string) => {
    setItemAmounts((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }));
  };

  const subtractAmount = (itemName: string) => {
    setItemAmounts((prev) => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 0) - 1, 0),
    }));
  };

  return (
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
              <Card
                key={item.name}
                className="bg-gray-800 text-white overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-2 flex-grow overflow-hidden line-clamp-3">
                    {item.short_description}
                  </p>
                  <p className="mt-auto font-bold text-blue-400">
                    ${item.price.toFixed(2)}
                  </p>
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
  );
};

export default SmartOrderTabs;
