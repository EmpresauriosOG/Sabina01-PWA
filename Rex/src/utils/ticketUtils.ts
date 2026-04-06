import axios from "axios";
import {
  getApiErrorMessage,
  resolveArrayPayload,
  resolveObjectPayload,
} from "@/shared/contracts/api";

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
    const response = await axios.request(options);
    const ticket = resolveObjectPayload<Ticket>(response.data, ["ticket"]);

    if (!ticket) {
      throw new Error("Ticket response payload is empty.");
    }

    return ticket;
  } catch (error) {
    console.error("Oops creating ticket");
    throw new Error(
      getApiErrorMessage(error, "Failed to create ticket. Please try again later.")
    );
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
    return {
      tickets: resolveArrayPayload<Ticket>(response.data, ["tickets"]),
    };
  } catch (error) {
    console.error("Oops fetching tickets");
    throw new Error(
      getApiErrorMessage(error, "Failed to fetch tickets. Please try again later.")
    );
  }
};

export const closeTicket = async (ticket_id: string) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/tickets/${ticket_id}/close`,
  };
  try {
    const response = await axios.request(options);
    const ticket = resolveObjectPayload<Ticket>(response.data, ["ticket"]);

    if (!ticket) {
      throw new Error("Ticket close response payload is empty.");
    }

    return ticket;
  } catch (error) {
    console.error("Oops closing ticket");
    throw new Error(
      getApiErrorMessage(error, "Failed to close ticket. Please try again later.")
    );
  }
};
