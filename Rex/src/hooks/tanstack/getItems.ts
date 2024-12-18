import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Item {
  dish_id: string;
  dish_name: string;
  total_quantity: number;
  total_revenue: number;
  average_price: number;
}

export interface ItemsResponse {
  data: Item[];
}

const fetchItems = async (restaurant_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/item_performance/${restaurant_id}`,
  };

  const response = await axios.request(options);
  return response.data as ItemsResponse;
};

export const useItems = (restaurant_id: string) => {
  return useQuery({
    queryKey: ["items", restaurant_id],
    queryFn: () => fetchItems(restaurant_id),
    staleTime: 0,
  });
};