import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface HighestSellingItem {
  dish_id: string;
  dish_name: string;
  total_quantity: number;
  total_sales: number;
}

export interface HighestSellingResponse {
  data: HighestSellingItem;
}

const fetchHighestSelling = async (restaurant_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/highest_selling_item/${restaurant_id}`,
  };

  const response = await axios.request(options);
  return response.data as HighestSellingResponse;
};

export const useHighestSelling = (restaurant_id: string) => {
  return useQuery({
    queryKey: ["highest-selling", restaurant_id],
    queryFn: () => fetchHighestSelling(restaurant_id),
    staleTime: 0,
  });
};