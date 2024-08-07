import { Pencil } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
//Types
import { Ingredient } from "./types";
import { Staff } from "@/components/Staff/constants";
//Hooks & Utils
import { selectForm } from "@/components/forms/utils";
import { useUserStore } from "@/shared/state/userState";

interface ModifyButtonProps {
  item: Ingredient | Staff;
  dialogTitle: string;
  dialogDescription: string;
}

const ModifyButton = (props: ModifyButtonProps) => {
  const { dialogDescription, dialogTitle, item } = props;
  const formName = item.itemName || "NoName";
  const { user } = useUserStore();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {selectForm(
          formName,
          user?.location_id ?? "",
          user?.restaurant_id ?? "",
          item
        )}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyButton;
