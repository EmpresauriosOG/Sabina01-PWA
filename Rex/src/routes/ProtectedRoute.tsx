import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useKindeAuth();
  return (
    <>
      {isLoading && <p>Im Loading...</p>}
      {!isLoading && !isAuthenticated && (
        <div>
          <h1>Not Authenticated</h1>
          <button>Login</button>
        </div>
      )}

      {!isLoading && isAuthenticated && <Outlet />}
    </>
  );
};

export default ProtectedRoute;
