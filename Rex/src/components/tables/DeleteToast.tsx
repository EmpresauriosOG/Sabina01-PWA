import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface DeleteToastProps {
  item: string;
  onDelete: (item: string) => Promise<void>;
}

const DeleteToast = (props: DeleteToastProps) => {
  const { toast } = useToast();
  const { item, onDelete } = props;

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: "destructive",
          title: "Estas seguro?",
          description: item + " sera eliminado",
          action: (
            <>
              <ToastAction altText="Cancelar">Cancelar</ToastAction>
              <ToastAction onClick={() => onDelete(item)} altText="Eliminar">
                Eliminar
              </ToastAction>
            </>
          ),
        });
      }}
    >
      Eliminar
    </Button>
  );
};

export default DeleteToast;
