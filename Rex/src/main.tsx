import React from "react";
import ReactDOM from "react-dom/client";
import RootLayout from "./RootLayout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
//Setup Routes
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//Anytime your app throws an error while rendering, loading data, or performing data mutations, React Router will catch it and render an error screen. Let's make our own error page.
import ErrorPage from "./shared/ErrorPage.tsx";
import Login from "./auth/Login.tsx";
import SignUp from "./auth/SignUp.tsx";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import Restaurants from "./components/containers/Restaurants.tsx";
import AdminDashboard from "./components/containers/AdminDashboard.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
        ],
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/:restaurantId",
    element: <Restaurants />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain="https://empresauriosog.kinde.com"
      logoutUri={"http://localhost:5173/"}
      redirectUri={"http://localhost:5173/"}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </KindeProvider>
  </React.StrictMode>
);
