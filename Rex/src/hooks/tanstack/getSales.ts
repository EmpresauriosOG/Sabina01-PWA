import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resolveArrayPayload } from "@/shared/contracts/api";

//this is the cUrl of the API that will be fetched
//i wrote it so llm can help me make fetchSales function

// curl -X 'GET' \
//   'https://sabina01.onrender.com/kpis/daily_sales/665239a9f25b93e429b870bc?location_id=66523d74f25b93e429b870be' \
//   -H 'accept: application/json'

//this is the response of the API
//i wrote it so llm can know type of data that will be fetched

// {
//     "data": [
//       {
//         "date": "2024-11-14",
//         "total_sales": 85
//       }
//     ]
//   }

//this is the interface of the data that will be fetched from the API
export interface Sales {
  date: string;
  total_sales: number;
}
export interface SalesResponse {
  data: Sales[];
}
//this is the function that will fetch the data from the API
//this usex axios to make the request
const fetchSales = async (restaurant_id: string, location_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/kpis/daily_sales/${restaurant_id}?location_id=${location_id}`,
  };

  const response = await axios.request(options);
  const sales = resolveArrayPayload<Sales>(response.data, ["data"]);

  return { data: sales } as SalesResponse;
};

//this is the hook that will be used in the component
//it will return the data from the fetchSales function
//read the documentation of react-query to understand the parameters
export const useSales = (restaurant_id: string, location_id: string) => {
  return useQuery({
    //queryKey recieves an array with a unique identifier for the query, and the parameters that the query needs to be executed
    queryKey: ["sales", restaurant_id, location_id],
    queryFn: () => fetchSales(restaurant_id, location_id),
    //this is to avoid the cache, so the data is always fresh
    staleTime: 0,
  });
};
