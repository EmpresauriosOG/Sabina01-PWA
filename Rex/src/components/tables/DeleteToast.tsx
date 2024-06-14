import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import { deleteStaff } from "@/utils/staffUtils";

interface DeleteToastProps {
  item: string;
}

const DeleteToast = (props: DeleteToastProps) => {
  const { toast } = useToast();
  const { item } = props;
  const onClick = async () => {
    try {
      await deleteStaff(item);
      useFormSubmissionStore.getState().setStaffFormSubmitted(true);
    } catch (error) {
      console.log("Error Deleting Staff");
    }
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

export default DeleteToast;
