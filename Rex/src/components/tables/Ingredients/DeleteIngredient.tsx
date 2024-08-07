import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import { deleteIngredient } from "@/utils/ingredientUtils";

interface DeleteToastProps {
  item: string;
}

const DeleteIngredientToast = (props: DeleteToastProps) => {
  const { toast } = useToast();
  const { item } = props;
  const onClick = async () => {
    await deleteIngredient(item);
    useFormSubmissionStore.getState().setIngredientFormSubmitted(true);
  };
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
              <ToastAction onClick={onClick} altText="Eliminar">
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

export default DeleteIngredientToast;
