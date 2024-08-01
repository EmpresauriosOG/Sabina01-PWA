import { Ingredient } from "@/components/tables/Ingredients/types";
import axios from "axios";

interface IngredientsResponse {
  ingredients: Ingredient[];
}

export interface NoStaffFoundError {
  detail: string;
}

export const fetchIngredients = async (restaurant_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/ingredients/${restaurant_id}`,
  };
  try {
    const response = await axios.request(options);
    console.log(response);
    return response.data as IngredientsResponse;
  } catch (error) {
    console.error("Oops", error);
    return { ingredients: [] };
  }
};

export const submitIngredient = async (data: Omit<Ingredient, "id">) => {
  const options = {
    method: "POST",
    url: "https://sabina01.onrender.com/ingredients/upload-new-ingredient",
    data,
  };
  try {
    const response = await axios.request(options);
    console.log(data);
    console.log(response.data);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Oops");
    throw new Error(error);
  }
};

export const updateIngredient = async (data: Ingredient) => {
  const options = {
    method: "PUT",
    url: `https://sabina01.onrender.com/ingredients/update/${data.id}`,
    data,
  };
  try {
    const response = await axios.request(options);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Oops");
    throw new Error(error);
  }
};
