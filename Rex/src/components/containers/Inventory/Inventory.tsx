import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Ingredients from "./Ingredients";
import Dishes from "./Dishes";

const Inventory = () => {
  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="ingredientes" className="container">
        <TabsList>
          <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
          <TabsTrigger value="platillos">Platillos</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredientes">
          <Ingredients />
        </TabsContent>
        <TabsContent value="platillos">
          <Dishes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;