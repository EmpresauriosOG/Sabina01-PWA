import axios from "axios";
import { MenuItem } from "../components/tables/Dishes/types";

interface MenuResponse {
  menu_items: MenuItem[];
}

export const fetchMenuItems = async (restaurant_id: string, location_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/menu/${restaurant_id}/${location_id}`,
  };
  try {
    const response = await axios.request(options);
    return response.data as MenuResponse;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return { menu_items: [] };
  }
};

export const submitMenuItem = async (data: Omit<MenuItem, "id">) => {
  const options = {
    method: "POST",
    url: "https://sabina01.onrender.com/menu/upload-new-menu-item",
    data,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: unknown) {
    console.error("Error submitting menu item:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

export const updateMenuItem = async (data: MenuItem) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/menu/update/${data.id}`,
    data,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: unknown) {
    console.error("Error submitting menu item:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

export const deleteMenuItem = async (id: string) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/menu/delete-item/${id}`,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: unknown) {
    console.error("Error submitting menu item:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

export const updateDish = async (dish: MenuItem) => {
  try {
    await updateMenuItem(dish);
    return { success: true };
  } catch (error) {
    console.error("Error updating dish:", error);
    return { success: false, error };
  }
};