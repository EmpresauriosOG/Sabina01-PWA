//Forms
import { StaffForm } from "./StaffForm";
import { IngredientForm } from "./IngredientForm";
//Types
import { Ingredient } from "../tables/Ingredients/types";
import { Staff } from "../Staff/constants";

export function selectForm(
  itemName: string,
  location_id: string,
  restaurant_id: string,
  item?: Ingredient | Staff
) {
  switch (itemName) {
    case "staff":
      return (
        <StaffForm
          location_id={location_id}
          restaurant_id={restaurant_id}
          isModify={true}
          staffToModify={item as Staff}
        />
      );
    case "ingredient":
      return (
        <IngredientForm
          location_id={location_id}
          restaurant_id={restaurant_id}
          isModify={true}
          ingredientToModify={item as Ingredient}
        />
      );
    default:
      return (
        <StaffForm location_id={location_id} restaurant_id={restaurant_id} />
      );
  }
}
