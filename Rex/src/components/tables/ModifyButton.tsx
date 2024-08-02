import { Pencil } from "lucide-react";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IngredientForm } from "../forms/IngredientForm";
import { Ingredient } from "./Ingredients/types";
import { useUserStore } from "@/shared/state/userState";

interface ModifyButtonProps {
  ingredient: Ingredient;
  dialogTitle: string;
  dialogDescription: string;
}

const ModifyButton = (props: ModifyButtonProps) => {
  const { dialogDescription, dialogTitle, ingredient } = props;
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
        <IngredientForm
          location_id={user?.location_id}
          restaurant_id={user?.restaurant_id}
          isModify={false}
          ingredientToModify={ingredient}
        />
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
