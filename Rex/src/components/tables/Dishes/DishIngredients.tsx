import { useUserStore } from "@/shared/state/userState";
import { useIngredient } from "@/hooks/tanstack/useIngredient";
import { MenuItem } from "@/components/tables/Dishes/types";
import { UtensilsCrossed } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const DishIngredients = ({ menuItem }: { menuItem: MenuItem }) => {
  const { user } = useUserStore();
  const { data: ingredientData } = useIngredient(
    user?.restaurant_id,
    user?.location_id
  );

interface Ingredient {
    id: string;
    name: string;
    unit: string;
}

interface MenuItemIngredient {
    ingredient_id: string;
    quantity: number;
}

interface IngredientDetails {
    name: string;
    quantity: number;
    unit: string;
}

const ingredientDetails: IngredientDetails[] = menuItem.ingredients.map((ing: MenuItemIngredient) => {
    const ingredient: Ingredient | undefined = ingredientData?.ingredients.find((i: Ingredient) => i.id === ing.ingredient_id);
    return {
        name: ingredient?.name || "Unknown",
        quantity: ing.quantity,
        unit: ingredient?.unit || ""
    };
});

  return (
    <div className="flex items-center gap-2">
      <span>{menuItem.name}</span>
      <HoverCard>
        <HoverCardTrigger>
          <UtensilsCrossed className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Ingredientes</h4>
            <div className="text-sm space-y-1">
              {ingredientDetails.map((ing, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                  <span className="font-medium">{ing.name}</span>
                  <span className="text-muted-foreground">
                    {ing.quantity} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};