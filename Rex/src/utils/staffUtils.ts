import { UserResponse, User } from "@/hooks/tanstack/getUser";
import axios from "axios";

export interface NoStaffFoundError {
  detail: string;
}

export const fetchStaff = async (
  location_id: string,
  restaurant_id: string
) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/user/get_all_users/${restaurant_id}/${location_id}`,
  };

  const response = await axios.request(options);
  console.log(response);
  return response.data as UserResponse | NoStaffFoundError;
};

export const submitStaff = async (data: User) => {
  const options = {
    method: "POST",
    url: "https://sabina01.onrender.com/user/upload-new-user",
    data,
  };
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Oops");
    throw new Error(error);
  }
};
