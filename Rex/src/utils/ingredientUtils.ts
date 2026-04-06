import { Ingredient } from "@/components/tables/Ingredients/types";
import axios from "axios";
import {
  getApiErrorMessage,
  resolveArrayPayload,
  unwrapApiEnvelope,
} from "@/shared/contracts/api";

interface IngredientsResponse {
  ingredients: Ingredient[];
}

export interface NoStaffFoundError {
  detail: string;
}

export const fetchIngredients = async (restaurant_id: string, location_id: string) => {
  const options = {
    method: "GET",
    url: `https://sabina01.onrender.com/ingredients/${restaurant_id}/${location_id}`,
  };
  try {
    const response = await axios.request(options);
    const ingredients = resolveArrayPayload<Ingredient>(response.data, [
      "ingredients",
    ]);

    return { ingredients } as IngredientsResponse;
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
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops");
    throw new Error(
      getApiErrorMessage(error, "Failed to create ingredient.")
    );
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
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops");
    throw new Error(
      getApiErrorMessage(error, "Failed to update ingredient.")
    );
  }
};

export const deleteIngredient = async (id: string) => {
  const options = {
    method: "DELETE",
    url: `https://sabina01.onrender.com/ingredients/delete-ingredient/${id}`,
  };
  try {
    const response = await axios.request(options);
    return unwrapApiEnvelope<unknown>(response.data);
  } catch (error) {
    console.error("Oops");
    throw new Error(
      getApiErrorMessage(error, "Failed to delete ingredient.")
    );
  }
};
