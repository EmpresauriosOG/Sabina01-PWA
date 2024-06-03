import { User } from "@/hooks/tanstack/getUser";
import create from "zustand";

type UserState = {
  user: null | User;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
