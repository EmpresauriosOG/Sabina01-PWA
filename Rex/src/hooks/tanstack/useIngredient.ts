import { fetchIngredients } from "@/utils/ingredientUtils";
import { useQuery } from "@tanstack/react-query";

export const useIngredient = (restaurant_id?: string, location_id?: string) => {
  return useQuery({
    queryKey: ["ingredient", restaurant_id, location_id],
    queryFn: () => fetchIngredients(restaurant_id || "", location_id || ""),
    staleTime: 0,
  });
};
