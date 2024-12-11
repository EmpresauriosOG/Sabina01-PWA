import axios from "axios";

export interface Table {
  _id: string;
  restaurant_id: string;
  location_id: string;
  spaces: Space[];
}

export interface Space {
  name: string;
  tables: TableInfo[];
}

export interface TableInfo {
  table_number: number;
  status: number;
  current_waiter: string | null;
  number_of_persons: number;
  guest_names: string[];
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
    return response.data.table as Table[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Oops");
    throw new Error(error);
  }
};
