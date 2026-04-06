import axios from "axios";
import {
  getApiErrorMessage,
  resolveObjectPayload,
  unwrapApiEnvelope,
} from "@/shared/contracts/api";

export interface TablesResponse {
  _id: string;
  restaurant_id: string;
  location_id: string;
  spaces: Space[];
}

export interface Space {
  name: string;
  space_id: string;
  tables: Table[];
}

export interface Table {
  table_number: number;
  status: number;
  current_waiter: string | null;
  number_of_persons: number;
  guest_names: string[];
  table_id: string;
}

const EMPTY_TABLES_RESPONSE: TablesResponse = {
  _id: "",
  restaurant_id: "",
  location_id: "",
  spaces: [],
};

export const fetchTables = async (
  restaurant_id: string,
  location_id: string
): Promise<TablesResponse> => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}`,
  };
  try {
    const response = await axios.request(options);
    const parsed = resolveObjectPayload<TablesResponse>(response.data, [
      "table",
      "tables",
    ]);

    return parsed ?? EMPTY_TABLES_RESPONSE;
  } catch (error) {
    console.error("Oops", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to fetch tables. Please try again later.")
    );
  }
};

export const addRestaurantSpace = async (
  restaurant_id: string,
  location_id: string,
  name: string,
  current_waiter: string
) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/add_space`,
    data: {
      name: name,
      tables: [
        {
          table_number: 0,
          status: 0,
          current_waiter: current_waiter,
          number_of_persons: 0,
          guest_names: [],
        },
      ],
    },
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to add restaurant space.")
    );
  }
};

export const addRestaurantTable = async (
  restaurant_id: string,
  location_id: string,
  space_id: string,
  table_number: number
) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_id}/add_table`,
    data: {
      table_number: table_number,
      status: 0,
      current_waiter: "",
      number_of_persons: 0,
      guest_names: [],
    },
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to add restaurant table.")
    );
  }
};

export const updateRestaurantTable = async (
  restaurant_id: string,
  location_id: string,
  space_id: string,
  table_id: string,
  current_waiter?: string,
  guest_names?: string[],
  number_of_persons?: number,
  status?: number
) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_id}/${table_id}/update`,
    data: {
      status: status || 0,
      current_waiter: current_waiter || "",
      number_of_persons: number_of_persons || 0,
      guest_names: guest_names || [],
    },
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to update restaurant table.")
    );
  }
};

//Delete Methods
export const deleteRestaurantTables = async (
  restaurant_id: string,
  location_id: string
) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}`,
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to delete restaurant tables.")
    );
  }
};

export const deleteRestaurantSpace = async (
  restaurant_id: string,
  location_id: string,
  space_id: string
) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_id}`,
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to delete restaurant space.")
    );
  }
};

// TODO [C3/BR-006]: The 3rd path segment here is ambiguous — callers currently pass
// space_id but the parameter was originally named space_name. Pending BR-006 confirmation
// of whether the backend route expects space_id or space_name.
export const deleteRestaurantTable = async (
  restaurant_id: string,
  location_id: string,
  space_id: string,
  table_id: string
) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_id}/${table_id}`,
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops", error);
    throw new Error(
      getApiErrorMessage(error, "Failed to delete restaurant table.")
    );
  }
};
