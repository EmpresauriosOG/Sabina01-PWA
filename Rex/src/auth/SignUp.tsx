import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useRef, useState } from "react";

// org_code?: string;
// app_state?: object;
// authUrlParams?: object;

export default function SignUp() {
  console.log("SignUp");
  const { register } = useKindeAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const restaurantRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<string | undefined>("");

  const handleRoleSelect = (value: string) => {
    setRole(value);
    console.log("Im being called with value: ", value);
  };

  const onSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    // Updated type of event parameter
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const restaurant = restaurantRef.current?.value;
    console.log(email, password, restaurant, role);
    if (email && password && restaurant && role) {
      register();
    }
  };
  return (
    <div className="mx-auto max-w-sm space-y-6 max-h-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information to create an account
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            required
            type="email"
            ref={emailRef}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password" ref={passwordRef} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurant">Restaurant</Label>
          <Input
            id="restaurant"
            placeholder="Enter your restaurant name"
            required
            ref={restaurantRef}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select required value={role} onValueChange={handleRoleSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="waiter">Waiter</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" type="submit" onClick={onSubmit}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}
