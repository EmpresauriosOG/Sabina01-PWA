import create from "zustand";

type FormSubmissionState = {
  staffFormSubmitted: boolean;
  setStaffFormSubmitted: (submitted: boolean) => void;
};

export const useFormSubmissionStore = create<FormSubmissionState>()((set) => ({
  staffFormSubmitted: false, // Initial state
  setStaffFormSubmitted: (submitted) => set({ staffFormSubmitted: submitted }), // Action to update the state
}));
