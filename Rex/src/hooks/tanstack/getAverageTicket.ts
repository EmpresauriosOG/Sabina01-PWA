import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resolveObjectPayload, getApiErrorMessage } from "@/shared/contracts/api";

export interface AverageTicket {
  average_ticket: number;
  total_orders: number;
  total_revenue: number;
}

export interface AverageTicketResponse {
  data: AverageTicket;
}

const fetchAverageTicket = async (restaurant_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/average_ticket/${restaurant_id}`,
  };

  try {
    const response = await axios.request(options);
    const averageTicket = resolveObjectPayload<AverageTicket>(response.data, [
      "data",
    ]) ?? {
      average_ticket: 0,
      total_orders: 0,
      total_revenue: 0,
    };
    return { data: averageTicket } as AverageTicketResponse;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch average ticket data."));
  }
};

export const useAverageTicket = (restaurant_id: string) => {
  return useQuery({
    queryKey: ["average-ticket", restaurant_id],
    queryFn: () => fetchAverageTicket(restaurant_id),
    staleTime: 0,
  });
};
