import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { deleteMenuItem } from "@/utils/menuUtils";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteDishProps {
  id: string;
  name: string;
  restaurant_id: string;
  location_id: string;
}

export const DeleteDish = ({
  id,
  name,
  restaurant_id,
  location_id,
}: DeleteDishProps) => {
  const { toast: shadcnToast } = useToast();
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

  const handleDelete = async () => {
    try {
      await deleteMenuItem(id);
      void invalidateMenuQuery();
      toast.success(`Platillo "${name}" eliminado exitosamente`);
    } catch (error) {
      console.error("Error deleting dish:", error);
      toast.error("Error al eliminar el platillo");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        shadcnToast({
          variant: "destructive",
          title: "¿Estás seguro?",
          description: `${name} será eliminado`,
          action: (
            <>
              <ToastAction altText="Cancelar">Cancelar</ToastAction>
              <ToastAction onClick={handleDelete} altText="Eliminar">
                Eliminar
              </ToastAction>
            </>
          ),
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
