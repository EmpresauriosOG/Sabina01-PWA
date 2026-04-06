import { Staff } from "@/components/Staff/constants";
import { User } from "@/hooks/tanstack/getUser";
import axios from "axios";
import {
  getApiErrorMessage,
  resolveArrayPayload,
  unwrapApiEnvelope,
} from "@/shared/contracts/api";

export interface NoStaffFoundError {
  detail: string;
}

export const fetchStaff = async (
  restaurant_id: string,
  location_id: string
): Promise<Staff[]> => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/user/get_all_users/${restaurant_id}/${location_id}`,
  };

  try {
    const response = await axios.request(options);
    return resolveArrayPayload<Staff>(response.data, ["user", "users"]);
  } catch (error) {
    console.error("Oops");
    throw new Error(
      getApiErrorMessage(error, "Failed to fetch staff. Please try again later.")
    );
  }
};

export const submitStaff = async (data: User) => {
  const options = {
    method: "POST",
    url: "https://sabina01.onrender.com/user/upload-new-user",
    data,
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops");
    throw new Error(
      getApiErrorMessage(error, "Failed to create staff member.")
    );
  }
};

export const deleteStaff = async (email: string) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/user/delete-user/${email}`,
  };

  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops");
    throw new Error(
      getApiErrorMessage(error, "Failed to delete staff member.")
    );
  }
};

export const modifyStaff = async (data: User) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/user/update/${data.email}`,
    data,
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops");
    throw new Error(
      getApiErrorMessage(error, "Failed to update staff member.")
    );
  }
};
