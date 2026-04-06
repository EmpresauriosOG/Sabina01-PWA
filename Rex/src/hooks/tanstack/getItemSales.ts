import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resolveArrayPayload } from "@/shared/contracts/api";

export interface ItemSale {
  dish_id: string;
  dish_name: string;
  quantity: number;
  sales: number;
}

export interface DailySales {
  date: string;
  items: ItemSale[];
}

export interface ItemSalesResponse {
  data: DailySales[];
}

const fetchItemSales = async (restaurant_id: string, location_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/item_sales/${restaurant_id}?location_id=${location_id}`,
  };

  const response = await axios.request(options);
  const itemSales = resolveArrayPayload<DailySales>(response.data, ["data"]);

  return { data: itemSales } as ItemSalesResponse;
};

export const useItemSales = (restaurant_id: string, location_id: string) => {
  return useQuery({
    queryKey: ["itemSales", restaurant_id, location_id],
    queryFn: () => fetchItemSales(restaurant_id, location_id),
    staleTime: 0,
  });
};
