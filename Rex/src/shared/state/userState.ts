import { User } from "@/hooks/tanstack/getUser";
import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  user: null | User;
  setUser: (user: User | null) => void;
  getRoles: () => Array<string> | undefined;
};

export const useUserStore = create<UserState, [["zustand/persist", UserState]]>(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      getRoles: () => get().user?.roles,
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
