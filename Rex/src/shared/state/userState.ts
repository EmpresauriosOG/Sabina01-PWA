import create from "zustand";

type UserState = {
  user: null | { given_name: string };
  setUser: (user: null | { given_name: string }) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
