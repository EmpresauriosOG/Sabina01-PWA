import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Ingredient } from "./Ingredients/types";

interface ModifyButtonProps {
  ingredient: Ingredient;
}

const ModifyButton = (props: ModifyButtonProps) => {
  return (
    <Button variant="outline" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  );
};

export default ModifyButton;
