import axios from "axios";

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

export const fetchTables = async (
  restaurant_id: string,
  location_id: string
) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}`,
  };
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data as TablesResponse;
  } catch (error) {
    console.error("Oops", error);
    return { tables: [] };
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
    return response.data;
  } catch (error) {
    console.error("Oops", error);
  }
};

export const addRestaurantTable = async (
  restaurant_id: string,
  location_id: string,
  space_name: string,
  table_number: number
) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_name}/add_table`,
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
    return response.data;
  } catch (error) {
    console.error("Oops", error);
  }
};

export const updateRestaurantTable = async (
  restaurant_id: string,
  location_id: string,
  space_name: string,
  table_number: number,
  current_waiter?: string,
  guest_names?: string[],
  number_of_persons?: number,
  status?: number
) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_name}/${table_number}/update`,
    data: {
      status: status || 0,
      current_waiter: current_waiter || "",
      number_of_persons: number_of_persons || 0,
      guest_names: guest_names || [],
    },
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Oops", error);
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
    return response.data;
  } catch (error) {
    console.error("Oops", error);
  }
};

export const deleteRestaurantSpace = async (
  restaurant_id: string,
  location_id: string,
  space_name: string
) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_name}`,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Oops", error);
  }
};

export const deleteRestaurantTable = async (
  restaurant_id: string,
  location_id: string,
  space_name: string,
  table_number: number
) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/tables/${restaurant_id}/${location_id}/${space_name}/${table_number}`,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Oops", error);
  }
};
