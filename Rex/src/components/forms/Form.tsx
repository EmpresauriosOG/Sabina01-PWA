import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useUserStore } from "@/shared/state/userState";
import { User, fetchUser } from "@/hooks/tanstack/getUser";
import { useState } from "react";

const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Email must be a Gmail address",
    }),
});
export function LoginForm() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async () => {
    // Handle form submission logic here
    try {
      setIsLoading(true);
      const userData = await fetchUser(form.getValues().email);
      console.log(userData);
      setIsLoading(false);
      // await signInWithGoogle(); // Assuming signInWithGoogle handles authentication
      // setUser(userData as User);
    } catch (err) {
      console.error("Error signing in:", err);
      // Handle sign-in errors (e.g., display an error message)
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input placeholder="ejemplo@gmail.com" {...field} />
              </FormControl>
              <FormDescription>Bait ;)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Todo listo </Button>
      </form>
    </Form>
  );
}
