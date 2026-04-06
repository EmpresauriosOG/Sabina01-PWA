import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resolveArrayPayload } from "@/shared/contracts/api";

export interface OrderStatus {
  status: number;
  count: number;
}

export interface OrderStatusResponse {
  data: OrderStatus[];
}

export const STATUS_MAPPING: Record<number, { label: string, color: string }> = {
  1: { label: "Ordenadas", color: "hsl(var(--chart-1))" },
  2: { label: "Confirmadas", color: "hsl(var(--chart-2))" },
  3: { label: "Cocinando...", color: "hsl(var(--chart-3))" },
  4: { label: "Lista", color: "hsl(var(--chart-4))" },
  5: { label: "Entregada", color: "hsl(var(--chart-5))" },
};

const fetchOrderStatus = async (restaurant_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/order_status_distribution/${restaurant_id}`,
  };

  const response = await axios.request(options);
  const orderStatus = resolveArrayPayload<OrderStatus>(response.data, ["data"]);

  return { data: orderStatus } as OrderStatusResponse;
};

export const useOrderStatus = (restaurant_id: string) => {
  return useQuery({
    queryKey: ["orderStatus", restaurant_id],
    queryFn: () => fetchOrderStatus(restaurant_id),
    staleTime: 0,
  });
};
