import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import { deleteMenuItem } from "@/utils/menuUtils";
import { Trash2 } from "lucide-react";

interface DeleteDishProps {
  id: string;
  name: string;
}

export const DeleteDish = ({ id, name }: DeleteDishProps) => {
  const { toast } = useToast();
  
  const handleDelete = async () => {
    await deleteMenuItem(id);
    useFormSubmissionStore.getState().setDishFormSubmitted(true);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        toast({
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