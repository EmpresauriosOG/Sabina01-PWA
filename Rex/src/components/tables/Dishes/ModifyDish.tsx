import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuItem } from "@/components/tables/Dishes/types";
import DishModal from "@/components/modals/DishesModal";
import { updateDish } from "@/utils/menuUtils";
import { useState } from "react";
import { toast } from "sonner";

interface ModifyDishProps {
  item: MenuItem;
  onUpdate?: () => void;
}

export const ModifyDish = ({ item, onUpdate }: ModifyDishProps) => {
  const [open, setOpen] = useState(false);

  const handleUpdate = async (updatedDish: MenuItem) => {
    const result = await updateDish(updatedDish);
    if (result.success) {
      toast.success("Platillo actualizado exitosamente");
      setOpen(false);
      onUpdate?.();
    } else {
      toast.error("Error al actualizar el platillo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Modificar platillo</DialogTitle>
          <DialogDescription>Modifica los detalles del platillo</DialogDescription>
        </DialogHeader>
        <DishModal 
          location_id={item.location_id}
          restaurant_id={item.restaurant_id}
          editItem={item}
          onSubmit={handleUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};