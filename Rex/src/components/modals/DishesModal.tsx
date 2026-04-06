// DishModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useIngredient } from "@/hooks/tanstack/useIngredient";
import { submitMenuItem} from "@/utils/menuUtils";
import { MenuItem } from "@/components/tables/Dishes/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Minus, Plus, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mealTypes = ["Desayuno", "Comida", "Cena"];
const courseTypes = ["Entrada", "Plato fuerte", "Postre", "Bebida"];

interface DishModalProps {
  restaurant_id: string;
  location_id: string;
  editItem?: MenuItem;
  onSubmit?: (updatedDish: MenuItem) => Promise<void>;
  isNestedInDialog?: boolean;
}

export default function DishModal({ 
  restaurant_id, 
  location_id, 
  editItem, 
  onSubmit,
  isNestedInDialog = false
}: DishModalProps) {
  const [open, setOpen] = useState(false);
  const { data: ingredientData } = useIngredient(restaurant_id, location_id);
  const [selectedIngredients, setSelectedIngredients] = useState<Array<{ id: string; quantity: number }>>(
    editItem?.ingredients.map(ing => ({ id: ing.ingredient_id, quantity: ing.quantity })) || []
  );

  const [formData, setFormData] = useState({
    name: editItem?.name || '',
    short_description: editItem?.short_description || '',
    long_description: editItem?.long_description || '',
    price: editItem?.price || '',
    image: editItem?.image || '',
    meal_type: editItem?.meal_type || '',
    course_type: editItem?.course_type || '',
    attributes: editItem?.attributes || []
  });

  const [attributeInput, setAttributeInput] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(
    editItem?.attributes || []
  );

  const [imagePreview, setImagePreview] = useState<string | null>(editItem?.image || null);

  const [ingredientFilter, setIngredientFilter] = useState("");
  
  const filteredIngredients = ingredientData?.ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(ingredientFilter.toLowerCase())
  ) || [];

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Image = await convertToBase64(file);
        setImagePreview(base64Image);
        setFormData(prev => ({ ...prev, image: base64Image }));
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  const handleAddAttribute = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newAttribute = attributeInput.trim();
      if (newAttribute && !selectedAttributes.includes(newAttribute)) {
        setSelectedAttributes([...selectedAttributes, newAttribute]);
        setAttributeInput("");
      }
    }
  };

  const removeAttribute = (attr: string) => {
    setSelectedAttributes(selectedAttributes.filter(a => a !== attr));
  };

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        short_description: editItem.short_description,
        long_description: editItem.long_description,
        price: editItem.price,
        image: editItem.image,
        meal_type: editItem.meal_type,
        course_type: editItem.course_type,
        attributes: editItem.attributes
      });
      setSelectedIngredients(
        editItem.ingredients.map(ing => ({
          id: ing.ingredient_id,
          quantity: ing.quantity
        }))
      );
      setSelectedAttributes(editItem.attributes || []);
      setImagePreview(editItem.image || null);
    }
  }, [editItem]);

  const queryClient = useQueryClient();

  const invalidateMenuQuery = async () => {
    if (restaurant_id && location_id) {
      await queryClient.invalidateQueries({
        queryKey: ["menu", restaurant_id, location_id],
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["menu"] });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const menuItem = {
      name: formData.get("name") as string,
      short_description: formData.get("short_description") as string,
      long_description: formData.get("long_description") as string,
      price: Number(formData.get("price")),
      image: imagePreview || '', // Ensure image is always a string
      attributes: selectedAttributes,
      course_type: formData.get("course_type") as string,
      meal_type: formData.get("meal_type") as string,
      ingredients: selectedIngredients.map(ing => ({
        ingredient_id: ing.id,
        quantity: ing.quantity
      })),
      is_active: editItem?.is_active || 1,
      restaurant_id,
      location_id,
    };

    try {
      if (editItem) {
        const updatedDish = {
          ...editItem,
          ...menuItem,
        };
        if (onSubmit) {
          await onSubmit(updatedDish);
        } else {
          // If no onSubmit provided, handle submission directly
          await submitMenuItem(updatedDish);
          void invalidateMenuQuery();
          toast.success("Platillo modificado exitosamente");
        }
      } else {
        await submitMenuItem(menuItem);
        void invalidateMenuQuery();
        toast.success("Platillo creado exitosamente");
      }
      setOpen(false);
    } catch (error) {
      console.error("Error submitting dish:", error);
      toast.error("Error al guardar el platillo");
    }
  };

  const handleIngredientAdd = (ingredientId: string, quantity: number) => {
    setSelectedIngredients(prev => [...prev, { id: ingredientId, quantity }]);
  };

  // If this modal is nested in another dialog, just render the form without the Dialog wrapper
  if (isNestedInDialog) {
    return (
      <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={formData.name}
              placeholder="Nombre del platillo"
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="short_description" className="text-right">
              Descripción corta
            </Label>
            <Input
              id="short_description"
              name="short_description"
              defaultValue={formData.short_description}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="long_description" className="text-right">
              Descripción larga
            </Label>
            <Textarea
              id="long_description"
              name="long_description"
              defaultValue={formData.long_description}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Precio
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={formData.price}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Imagen
            </Label>
            <div className="col-span-3">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-[200px] h-auto rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meal_type" className="text-right">
              Tipo de comida
            </Label>
            <Select 
              name="meal_type" 
              value={formData.meal_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, meal_type: value }))}
              required
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course_type" className="text-right">
              Tipo de platillo
            </Label>
            <Select 
              name="course_type" 
              value={formData.course_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, course_type: value }))}
              required
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {courseTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Atributos</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {selectedAttributes.map(attr => (
                <div 
                  key={attr} 
                  className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {attr}
                  <button 
                    type="button" 
                    onClick={() => removeAttribute(attr)}
                    className="hover:text-primary/80"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <Input
                value={attributeInput}
                onChange={(e) => setAttributeInput(e.target.value)}
                onKeyDown={handleAddAttribute}
                placeholder="Agregar atributo"
                className="flex-grow"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Ingredientes</Label>
            <div className="col-span-3 bg-muted/20 p-3 rounded-md">
              <div className="flex items-center mb-3">
                <div className="relative flex-grow mr-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar ingredientes..."
                    value={ingredientFilter}
                    onChange={(e) => setIngredientFilter(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Badge variant="outline" className="bg-primary/5">
                  {selectedIngredients.length} seleccionados
                </Badge>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="all">Todos los ingredientes</TabsTrigger>
                  <TabsTrigger value="selected">Seleccionados ({selectedIngredients.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ScrollArea className="h-[200px]">
                    <div className="grid gap-1.5">
                      {filteredIngredients.map(ingredient => {
                        const isSelected = selectedIngredients.some(si => si.id === ingredient.id);
                        const selectedItem = selectedIngredients.find(si => si.id === ingredient.id);
                        
                        return (
                          <div 
                            key={ingredient.id} 
                            className={`flex items-center justify-between p-2 rounded-md border ${
                              isSelected ? "border-primary/60 bg-primary/5" : "border-border"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleIngredientAdd(ingredient.id!, 1);
                                  } else {
                                    setSelectedIngredients(prev => 
                                      prev.filter(si => si.id !== ingredient.id)
                                    );
                                  }
                                }}
                              />
                              <span>{ingredient.name}</span>
                            </div>
                            
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    const currentQuantity = selectedItem?.quantity || 0;
                                    if (currentQuantity > 1) {
                                      setSelectedIngredients(prev => 
                                        prev.map(si => 
                                          si.id === ingredient.id 
                                            ? { ...si, quantity: si.quantity - 1 }
                                            : si
                                        )
                                      );
                                    } else {
                                      setSelectedIngredients(prev => 
                                        prev.filter(si => si.id !== ingredient.id)
                                      );
                                    }
                                  }}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                
                                <Input
                                  type="number"
                                  min="1"
                                  className="h-7 w-16 text-center"
                                  value={selectedItem?.quantity || 0}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value <= 0) {
                                      setSelectedIngredients(prev => 
                                        prev.filter(si => si.id !== ingredient.id)
                                      );
                                    } else {
                                      setSelectedIngredients(prev => 
                                        prev.map(si => 
                                          si.id === ingredient.id 
                                            ? { ...si, quantity: value }
                                            : si
                                        )
                                      );
                                    }
                                  }}
                                />
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedIngredients(prev => 
                                      prev.map(si => 
                                        si.id === ingredient.id 
                                          ? { ...si, quantity: si.quantity + 1 }
                                          : si
                                      )
                                    );
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {filteredIngredients.length === 0 && (
                        <div className="py-6 text-center text-muted-foreground">
                          No se encontraron ingredientes con ese nombre
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="selected">
                  <ScrollArea className="h-[200px]">
                    <div className="grid gap-1.5">
                      {selectedIngredients.length > 0 ? selectedIngredients.map(selectedItem => {
                        const ingredient = ingredientData?.ingredients.find(ing => ing.id === selectedItem.id);
                        if (!ingredient) return null;
                        
                        return (
                          <div 
                            key={ingredient.id} 
                            className="flex items-center justify-between p-2 rounded-md border border-primary/60 bg-primary/5"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span>{ingredient.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  const currentQuantity = selectedItem.quantity;
                                  if (currentQuantity > 1) {
                                    setSelectedIngredients(prev => 
                                      prev.map(si => 
                                        si.id === ingredient.id 
                                          ? { ...si, quantity: si.quantity - 1 }
                                          : si
                                      )
                                    );
                                  } else {
                                    setSelectedIngredients(prev => 
                                      prev.filter(si => si.id !== ingredient.id)
                                    );
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <Input
                                type="number"
                                min="1"
                                className="h-7 w-16 text-center"
                                value={selectedItem.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value, 10);
                                  if (value <= 0) {
                                    setSelectedIngredients(prev => 
                                      prev.filter(si => si.id !== ingredient.id)
                                    );
                                  } else {
                                    setSelectedIngredients(prev => 
                                      prev.map(si => 
                                        si.id === ingredient.id 
                                          ? { ...si, quantity: value }
                                          : si
                                      )
                                    );
                                  }
                                }}
                              />
                              
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setSelectedIngredients(prev => 
                                    prev.map(si => 
                                      si.id === ingredient.id 
                                        ? { ...si, quantity: si.quantity + 1 }
                                        : si
                                    )
                                  );
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="py-6 text-center text-muted-foreground">
                          No hay ingredientes seleccionados
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 pt-2 bg-background">
          <Button type="submit">Guardar platillo</Button>
        </DialogFooter>
      </form>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{editItem ? 'Modificar platillo' : 'Agregar platillo'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Modificar platillo' : 'Agregar nuevo platillo'}</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del nuevo platillo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-3">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={formData.name}
                placeholder="Nombre del platillo"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="short_description" className="text-right">
                Descripción corta
              </Label>
              <Input
                id="short_description"
                name="short_description"
                defaultValue={formData.short_description}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="long_description" className="text-right">
                Descripción larga
              </Label>
              <Textarea
                id="long_description"
                name="long_description"
                defaultValue={formData.long_description}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                defaultValue={formData.price}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Imagen
              </Label>
              <div className="col-span-3">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-[200px] h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal_type" className="text-right">
                Tipo de comida
              </Label>
              <Select 
                name="meal_type" 
                value={formData.meal_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, meal_type: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_type" className="text-right">
                Tipo de platillo
              </Label>
              <Select 
                name="course_type" 
                value={formData.course_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, course_type: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Atributos</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {selectedAttributes.map(attr => (
                  <div 
                    key={attr} 
                    className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded"
                  >
                    {attr}
                    <button 
                      type="button" 
                      onClick={() => removeAttribute(attr)}
                      className="hover:text-primary/80"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <Input
                  value={attributeInput}
                  onChange={(e) => setAttributeInput(e.target.value)}
                  onKeyDown={handleAddAttribute}
                  placeholder="Agregar atributo"
                  className="flex-grow"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Ingredientes</Label>
              <div className="col-span-3 bg-muted/20 p-3 rounded-md">
                <div className="flex items-center mb-3">
                  <div className="relative flex-grow mr-2">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar ingredientes..."
                      value={ingredientFilter}
                      onChange={(e) => setIngredientFilter(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Badge variant="outline" className="bg-primary/5">
                    {selectedIngredients.length} seleccionados
                  </Badge>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-2">
                    <TabsTrigger value="all">Todos los ingredientes</TabsTrigger>
                    <TabsTrigger value="selected">Seleccionados ({selectedIngredients.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <ScrollArea className="h-[200px]">
                      <div className="grid gap-1.5">
                        {filteredIngredients.map(ingredient => {
                          const isSelected = selectedIngredients.some(si => si.id === ingredient.id);
                          const selectedItem = selectedIngredients.find(si => si.id === ingredient.id);
                          
                          return (
                            <div 
                              key={ingredient.id} 
                              className={`flex items-center justify-between p-2 rounded-md border ${
                                isSelected ? "border-primary/60 bg-primary/5" : "border-border"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleIngredientAdd(ingredient.id!, 1);
                                    } else {
                                      setSelectedIngredients(prev => 
                                        prev.filter(si => si.id !== ingredient.id)
                                      );
                                    }
                                  }}
                                />
                                <span>{ingredient.name}</span>
                              </div>
                              
                              {isSelected && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const currentQuantity = selectedItem?.quantity || 0;
                                      if (currentQuantity > 1) {
                                        setSelectedIngredients(prev => 
                                          prev.map(si => 
                                            si.id === ingredient.id 
                                              ? { ...si, quantity: si.quantity - 1 }
                                              : si
                                          )
                                        );
                                      } else {
                                        setSelectedIngredients(prev => 
                                          prev.filter(si => si.id !== ingredient.id)
                                        );
                                      }
                                    }}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  
                                  <Input
                                    type="number"
                                    min="1"
                                    className="h-7 w-16 text-center"
                                    value={selectedItem?.quantity || 0}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10);
                                      if (value <= 0) {
                                        setSelectedIngredients(prev => 
                                          prev.filter(si => si.id !== ingredient.id)
                                        );
                                      } else {
                                        setSelectedIngredients(prev => 
                                          prev.map(si => 
                                            si.id === ingredient.id 
                                              ? { ...si, quantity: value }
                                              : si
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      setSelectedIngredients(prev => 
                                        prev.map(si => 
                                          si.id === ingredient.id 
                                            ? { ...si, quantity: si.quantity + 1 }
                                            : si
                                        )
                                      );
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {filteredIngredients.length === 0 && (
                          <div className="py-6 text-center text-muted-foreground">
                            No se encontraron ingredientes con ese nombre
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="selected">
                    <ScrollArea className="h-[200px]">
                      <div className="grid gap-1.5">
                        {selectedIngredients.length > 0 ? selectedIngredients.map(selectedItem => {
                          const ingredient = ingredientData?.ingredients.find(ing => ing.id === selectedItem.id);
                          if (!ingredient) return null;
                          
                          return (
                            <div 
                              key={ingredient.id} 
                              className="flex items-center justify-between p-2 rounded-md border border-primary/60 bg-primary/5"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>{ingredient.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    const currentQuantity = selectedItem.quantity;
                                    if (currentQuantity > 1) {
                                      setSelectedIngredients(prev => 
                                        prev.map(si => 
                                          si.id === ingredient.id 
                                            ? { ...si, quantity: si.quantity - 1 }
                                            : si
                                        )
                                      );
                                    } else {
                                      setSelectedIngredients(prev => 
                                        prev.filter(si => si.id !== ingredient.id)
                                      );
                                    }
                                  }}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                
                                <Input
                                  type="number"
                                  min="1"
                                  className="h-7 w-16 text-center"
                                  value={selectedItem.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value <= 0) {
                                      setSelectedIngredients(prev => 
                                        prev.filter(si => si.id !== ingredient.id)
                                      );
                                    } else {
                                      setSelectedIngredients(prev => 
                                        prev.map(si => 
                                          si.id === ingredient.id 
                                            ? { ...si, quantity: value }
                                            : si
                                        )
                                      );
                                    }
                                  }}
                                />
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedIngredients(prev => 
                                      prev.map(si => 
                                        si.id === ingredient.id 
                                          ? { ...si, quantity: si.quantity + 1 }
                                          : si
                                      )
                                    );
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        }) : (
                          <div className="py-6 text-center text-muted-foreground">
                            No hay ingredientes seleccionados
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 pt-2 bg-background">
            <Button type="submit">Guardar platillo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
