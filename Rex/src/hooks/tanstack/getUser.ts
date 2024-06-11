import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// interface Restaurant {
//   restaurant_id: string;
//   location: string;
// }

export enum Roles {
  admin = "admin",
  manager = "manager",
  staff = "staff",
  waiter = "waiter",
  kitchen = "kitchen",
  hostess = "hostess",
}

export interface UserResponse {
  user: Array<User>;
}

export interface User {
  location_id: string;
  first_name: string;
  last_name: string;
  email: string;
  // lets review this logic
  // restaurant_id: Array<Restaurant>;
  restaurant_id: string;
  roles: Array<Roles>;
}

interface UserNotFoundError {
  user: [];
}

export const fetchUser = async (email: string) => {
  console.log(email);
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/login/get_user_info/${email}`,
  };

  const response = await axios.request(options);
  console.log(response);
  return response.data as UserResponse | UserNotFoundError;
};

export const useUser = (email: string) => {
  return useQuery({
    queryKey: ["email", email],
    queryFn: () => fetchUser(email),
    enabled: !!email,
    staleTime: 0,
  });
};
