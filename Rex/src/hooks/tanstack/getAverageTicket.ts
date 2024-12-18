import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

  const response = await axios.request(options);
  return response.data as AverageTicketResponse;
};

export const useAverageTicket = (restaurant_id: string) => {
  return useQuery({
    queryKey: ["average-ticket", restaurant_id],
    queryFn: () => fetchAverageTicket(restaurant_id),
    staleTime: 0,
  });
};