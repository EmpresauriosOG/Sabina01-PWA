import create from "zustand";

type FormSubmissionState = {
  staffFormSubmitted: boolean;
  ingredientFormSubmitted: boolean;
  dishFormSubmitted: boolean;
  setStaffFormSubmitted: (submitted: boolean) => void;
  setIngredientFormSubmitted: (submitted: boolean) => void;
  setDishFormSubmitted: (submitted: boolean) => void;
};

export const useFormSubmissionStore = create<FormSubmissionState>()((set) => ({
  staffFormSubmitted: false,
  ingredientFormSubmitted: false,
  dishFormSubmitted: false,
  setStaffFormSubmitted: (submitted) => set({ staffFormSubmitted: submitted }),
  setIngredientFormSubmitted: (submitted) => set({ ingredientFormSubmitted: submitted }),
  setDishFormSubmitted: (submitted) => set({ dishFormSubmitted: submitted }),
}));