import create from "zustand";

type FormSubmissionState = {
  staffFormSubmitted: boolean;
  ingredientFormSubmitted: boolean;
  setStaffFormSubmitted: (submitted: boolean) => void;
  setIngredientFormSubmitted: (submitted: boolean) => void;
};

export const useFormSubmissionStore = create<FormSubmissionState>()((set) => ({
  staffFormSubmitted: false, // Initial state
  ingredientFormSubmitted: false, // Initial state
  setStaffFormSubmitted: (submitted) => set({ staffFormSubmitted: submitted }), // Action to update the state
  setIngredientFormSubmitted: (submitted) =>
    set({ ingredientFormSubmitted: submitted }), // Action to update the state
}));
