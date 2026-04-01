import axios from "axios";

export interface Ticket {
  _id: string;
  restaurant_id: string;
  location_id: string;
  table_id: string;
  status: number;
  created_ts: string;
  waiter: string;
  person_count: number;
  total_price: number;
  orders_count: number;
}

export interface TicketResponse {
  tickets: Ticket[];
}

export const createTicket = async (table_id: string) => {
  const options = {
    method: "POST",
    url: `https://sabina01.onrender.com/tickets/create/${table_id}`,
  };

  try {
    console.log("options", options);
    const response = await axios.request(options);
    return response.data as Ticket;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Oops creating ticket");
    throw new Error(error);
  }
};

export const fetchTickets = async (
  restaurant_id: string,
  location_id: string
) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/tickets/${restaurant_id}/${location_id}`,
  };

  try {
    const response = await axios.request(options);
    return response.data as TicketResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Oops fetching tickets");
    throw new Error(error);
  }
};

export const closeTicket = async (ticket_id: string) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/tickets/${ticket_id}/close`,
  };
  try {
    const response = await axios.request(options);
    return response.data as Ticket;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Oops closing ticket");
    throw new Error(error);
  }
};
