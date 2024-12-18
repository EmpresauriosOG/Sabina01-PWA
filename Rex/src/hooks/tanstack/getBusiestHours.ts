import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface HourlyData {
  hour: number;
  order_count: number;
}

export interface BusiestHoursResponse {
  data: HourlyData[];
}

const fetchBusiestHours = async (restaurant_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/busiest_hours/${restaurant_id}`,
  };

  const response = await axios.request(options);
  return response.data as BusiestHoursResponse;
};

export const useBusiestHours = (restaurant_id: string) => {
  return useQuery({
    queryKey: ["busiest-hours", restaurant_id],
    queryFn: () => fetchBusiestHours(restaurant_id),
    staleTime: 0,
  });
};