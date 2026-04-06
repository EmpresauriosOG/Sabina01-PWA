import axios from "axios";
import {
  getApiErrorMessage,
  resolveArrayPayload,
  unwrapApiEnvelope,
} from "@/shared/contracts/api";

export interface Order {
  restaurant_id: string;
  location_id: string;
  _id: string;
  items: {
    dish_id: string;
    quantity: number;
    dish_name: string;
  }[];
  total_price: number;
  status: number;
  ordered_ts: string;
  preparation_ts: string | null;
  serving_ts: string | null;
  special_instructions: string | null;
}

export interface CartOrder {
  items: { dish_id: string; quantity: number }[];
  special_instructions: string | null;
  ticket_id: string;
}

export interface OrdersResponse {
  orders: Order[];
}

export const fetchOrders = async (
  restaurant_id: string,
  location_id: string
): Promise<OrdersResponse> => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/orders/${restaurant_id}/${location_id}`,
  };

  try {
    const response = await axios.request(options);
    const orders = resolveArrayPayload<Order>(response.data, ["orders"]);

    return { orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to fetch orders. Please try again later.")
    );
  }
};

export const uploadOrder = async (order: CartOrder) => {
  if (!order.ticket_id || order.ticket_id.trim().length === 0) {
    throw new Error(
      "Missing ticket_id for order submission. An active ticket is required."
    );
  }

  const options = {
    method: "POST",
    url: "https://sabina01.onrender.com/orders/upload-order",
    data: {
      items: order.items,
      special_instructions: order.special_instructions,
      ticket_id: order.ticket_id,
    },
  };

  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Error uploading order:", error);
    throw new Error(
      getApiErrorMessage(
        error,
        "An unexpected error occurred while uploading the order."
      )
    );
  }
};

export const updateOrder = async (order_id: string, status: number) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/orders/${order_id}/${status}`,
  };

  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to update order. Please try again later.")
    );
  }
};
