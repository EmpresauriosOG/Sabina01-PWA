import { fetchIngredients } from "@/utils/ingredientUtils";
import { useQuery } from "@tanstack/react-query";

export const useIngredient = (restaurant_id?: string) => {
  return useQuery({
    queryKey: ["ingredient", restaurant_id],
    queryFn: () => fetchIngredients(restaurant_id || ""),
    staleTime: 0,
  });
};
