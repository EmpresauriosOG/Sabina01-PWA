import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface ModalFormProps {
  buttonTitle: string;
  dialogTitle: string;
  dialogDescription: string;
  form: JSX.Element;
}

const ModalForm = (props: ModalFormProps) => {
  const { buttonTitle, dialogTitle, dialogDescription, form } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {form}
        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalForm;
