import { createContext, useContext, useEffect } from "react";
import { supabase } from "../supabase/supabase.config";
import { redirect } from "react-router-dom";
import { fetchUser, User } from "@/hooks/tanstack/getUser";
import { useUserStore } from "@/shared/state/userState";
const AuthContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signInWithGoogle: (_: string) => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log(supabase);
  const { setUser } = useUserStore();

  async function signInWithGoogle(email: string) {
    try {
      const userData = await fetchUser(email);
      if ("user" in userData && userData.user.length === 0) {
        return false;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        throw new Error(error.message);
      }
      setUser(userData.user[0] as User);
      return true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  }

  async function signOut() {
    console.log("Signing out");
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUser(null);
    return;
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("supabase event: ", event);
        if (session == null) {
          redirect("/");
        } else {
          console.log("data del usuario", session?.user.user_metadata);
          redirect("/");
        }
      }
    );
    return () => {
      authListener.subscription;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
