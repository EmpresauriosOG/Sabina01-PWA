import { fetchTables } from "@/utils/tablesUtils";
import { useQuery } from "@tanstack/react-query";

export const useQueryTables = (
  restaurant_id?: string,
  location_id?: string
) => {
  return useQuery({
    queryKey: ["tables", restaurant_id, location_id],
    queryFn: () => fetchTables(restaurant_id || "", location_id || ""),
    staleTime: 0,
  });
};
