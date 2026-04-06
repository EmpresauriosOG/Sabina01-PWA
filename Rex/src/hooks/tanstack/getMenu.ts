import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { MenuItem } from "@/components/menu/types";
import { resolveArrayPayload } from "@/shared/contracts/api";

export const useMenu = (restaurantId: string, locationId: string) => {
  return useQuery({
    queryKey: ["menu", restaurantId, locationId],
    queryFn: async () => {
      const response = await axios.get(
        `https://sabina01.onrender.com/menu/${restaurantId}/${locationId}`
      );

      return resolveArrayPayload<MenuItem>(response.data, [
        "menu",
        "menu_items",
      ]);
    },
  });
};
