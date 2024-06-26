import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Inventory = () => {
  return (
    <div className="container mx-auto py-10 bg-slate-500">
      <Tabs defaultValue="ingredientes" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
          <TabsTrigger value="platillos">Platillos</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredientes">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="platillos">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
