import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClerkSignUp routing="hash" />
    </div>
  );
}
