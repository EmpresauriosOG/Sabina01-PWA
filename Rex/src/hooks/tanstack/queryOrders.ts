import { fetchOrders } from "@/utils/orderUtils";
import { useQuery } from "@tanstack/react-query";

export const useQueryOrders = (
  restaurant_id?: string,
  location_id?: string
) => {
  return useQuery({
    queryKey: ["orders", restaurant_id, location_id],
    queryFn: () => fetchOrders(restaurant_id || "", location_id || ""),
    staleTime: 0,
    select: (data) => data.orders,
  });
};
