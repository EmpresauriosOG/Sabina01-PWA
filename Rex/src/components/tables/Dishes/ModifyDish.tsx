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
import { useQueryClient } from "@tanstack/react-query";

interface ModifyDishProps {
  item: MenuItem;
  onUpdate?: () => void;
}

export const ModifyDish = ({ item, onUpdate }: ModifyDishProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const invalidateMenuQuery = async () => {
    if (item.restaurant_id && item.location_id) {
      await queryClient.invalidateQueries({
        queryKey: ["menu", item.restaurant_id, item.location_id],
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["menu"] });
  };

  const handleUpdate = async (updatedDish: MenuItem) => {
    const result = await updateDish(updatedDish);
    if (result.success) {
      toast.success("Platillo actualizado exitosamente");
      setOpen(false);
      void invalidateMenuQuery();
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
          isNestedInDialog={true}
        />
      </DialogContent>
    </Dialog>
  );
};
