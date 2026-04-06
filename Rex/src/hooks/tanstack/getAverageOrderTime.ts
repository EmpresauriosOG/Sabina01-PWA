import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resolveObjectPayload } from "@/shared/contracts/api";

export interface AverageOrderTimes {
  avg_order_to_confirm: number;
  avg_confirm_to_preparation: number;
  avg_preparation_to_serving: number;
  avg_serving_to_completion: number;
  avg_total_time: number;
}

export interface AverageOrderTimesResponse {
  data: AverageOrderTimes;
}

const fetchAverageOrderTimes = async (restaurant_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/average_order_times/${restaurant_id}`,
  };

  const response = await axios.request(options);
  const averageOrderTimes = resolveObjectPayload<AverageOrderTimes>(
    response.data,
    ["data"]
  ) ?? {
    avg_order_to_confirm: 0,
    avg_confirm_to_preparation: 0,
    avg_preparation_to_serving: 0,
    avg_serving_to_completion: 0,
    avg_total_time: 0,
  };

  return { data: averageOrderTimes } as AverageOrderTimesResponse;
};

export const useAverageOrderTimes = (restaurant_id: string) => {
  return useQuery({
    queryKey: ["average-order-times", restaurant_id],
    queryFn: () => fetchAverageOrderTimes(restaurant_id),
    staleTime: 0,
  });
};
