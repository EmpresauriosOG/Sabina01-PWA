import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Restaurant {
  restaurant_id: string;
  location: string;
}

enum Roles {
  admin = "admin",
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  restaurant: Array<Restaurant>;
  roles: Array<Roles>;
}

interface UserNotFoundError {
  detail: string;
}

export const fetchUser = async (email: string) => {
  console.log(email);
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/login/get_user_info/${email}`,
  };

  const response = await axios.request(options);
  console.log(response);
  return response.data as User | UserNotFoundError;
};

export const useUser = (email: string) => {
  return useQuery({
    queryKey: ["email", email],
    queryFn: () => fetchUser(email),
    enabled: !!email,
    staleTime: 0,
  });
};
