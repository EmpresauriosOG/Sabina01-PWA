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
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import { useState, useEffect } from "react";
import { useIngredient } from "@/hooks/tanstack/useIngredient";
import { submitMenuItem} from "@/utils/menuUtils";
import { MenuItem } from "@/components/tables/Dishes/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const mealTypes = ["Desayuno", "Comida", "Cena"];
const courseTypes = ["Entrada", "Plato fuerte", "Postre", "Bebida"];

interface DishModalProps {
  restaurant_id: string;
  location_id: string;
  editItem?: MenuItem;
  onSubmit?: (updatedDish: MenuItem) => Promise<void>;
}

export default function DishModal({ restaurant_id, location_id, editItem, onSubmit }: DishModalProps) {
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
    }
  }, [editItem]);

  const setStaffFormSubmitted = useFormSubmissionStore((state) => state.setStaffFormSubmitted);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const menuItem = {
      name: formData.get("name") as string,
      short_description: formData.get("short_description") as string,
      long_description: formData.get("long_description") as string,
      price: Number(formData.get("price")),
      image: formData.get("image") as string,
      attributes: selectedAttributes,
      course_type: formData.get("course_type") as string,
      meal_type: formData.get("meal_type") as string,
      ingredients: selectedIngredients.map(ing => ({
        ingredient_id: ing.id,
        quantity: ing.quantity
      })),
      is_active: 1,
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
        }
      } else {
        await submitMenuItem(menuItem);
      }
      setStaffFormSubmitted(true);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting dish:", error);
    }
  };

  const handleIngredientAdd = (ingredientId: string, quantity: number) => {
    setSelectedIngredients(prev => [...prev, { id: ingredientId, quantity }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{editItem ? 'Modificar platillo' : 'Agregar platillo'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Modificar platillo' : 'Agregar nuevo platillo'}</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo platillo
            </DialogDescription>
          </DialogHeader>
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
                URL de imagen
              </Label>
              <Input
                id="image"
                name="image"
                type="url"
                defaultValue={formData.image}
                className="col-span-3"
                required
              />
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Ingredientes</Label>
              <div className="col-span-3">
                {ingredientData?.ingredients.map(ingredient => (
                  <div key={ingredient.id} className="flex items-center gap-2 mb-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedIngredients.some(si => si.id === ingredient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const quantity = prompt(`Cantidad de ${ingredient.name}:`, 
                              selectedIngredients.find(si => si.id === ingredient.id)?.quantity?.toString() || '1'
                            );
                            if (quantity) {
                              handleIngredientAdd(ingredient.id!, Number(quantity));
                            }
                          } else {
                            setSelectedIngredients(prev => prev.filter(si => si.id !== ingredient.id));
                          }
                        }}
                      />
                      {ingredient.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar platillo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
