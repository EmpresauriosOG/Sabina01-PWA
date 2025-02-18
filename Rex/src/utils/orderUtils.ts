import axios from "axios";
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

export const fetchOrders = async (
  restaurant_id: string,
  location_id: string
) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/orders/${restaurant_id}/${location_id}`,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders. Please try again later.");
  }
};

//ToDo: Fix this flow
export const uploadOrder = async (order: CartOrder) => {
  const options = {
    method: "POST",
    url: "https://sabina01.onrender.com/orders/upload-order",
    data: {
      items: order.items,
      special_instructions: order.special_instructions,
      ticket_id: "67296617b5cb4f83a12608c3",
    },
  };

  try {
    const response = await axios.request(options);

    return response.data;
  } catch (error) {
    console.error("Error uploading order:", error);
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(
        `Failed to upload order: ${
          error.response.data.message || error.message
        }`
      );
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      throw new Error(
        "No response received from server. Please check your network connection."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(
        "An unexpected error occurred while uploading the order."
      );
    }
  }
};

export const updateOrder = async (order_id: string, status: number) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/orders/${order_id}/${status}`,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order. Please try again later.");
  }
};
