import { fetchStaff } from "@/utils/staffUtils";
import { useQuery } from "@tanstack/react-query";

export const useStaff = (restaurant_id?: string, location_id?: string) => {
  return useQuery({
    queryKey: ["staff", restaurant_id, location_id],
    queryFn: () => fetchStaff(restaurant_id || "", location_id || ""),
    staleTime: 0,
  });
};
