import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Ingredients from "./Ingredients";
const Inventory = () => {
  return (
    <div className="container mx-auto py-10 bg-slate-500">
      <Tabs defaultValue="ingredientes" className="container">
        <TabsList>
          <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
          <TabsTrigger value="platillos">Otros</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredientes">
          <Ingredients />
        </TabsContent>
        <TabsContent value="platillos">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
