import React from "react";
import ReactDOM from "react-dom/client";
import RootLayout from "./RootLayout";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
//Setup Routes
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//Anytime your app throws an error while rendering, loading data, or performing data mutations, React Router will catch it and render an error screen. Let's make our own error page.
import ErrorPage from "./shared/ErrorPage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
// import Restaurants from "./components/containers/Restaurants.tsx";
import Menu from "./components/Menu";
import OTPTable from "./components/menu/OTPTable";
import Sidebar from "./components/management/Sidebar/Sidebar";
import Staff from "./components/containers/Staff";
import Inventory from "./components/containers/Inventory/Inventory";
//Context
import { ThemeProvider } from "./components/theme-provider";
// import { AuthProvider } from "./context/AuthContext.tsx";
import OrderContainer from "./components/containers/Orders/OrderContainer";
import RestaurantTablesContainer from "./components/containers/RestaurantTables/RestaurantTablesContainer";
import SmartOrder from "./components/containers/SmartOrder/SmartOrder";
import Kpis from "./components/containers/Kpis/Kpis";
import Tickets from "@/routes/Tickets";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <SmartOrder />,
          },
          {
            path: "/sidebar",
            element: <Sidebar />,
          },
          {
            path: "/my-staff",
            element: <Staff />,
          },
          {
            path: "/inventory",
            element: <Inventory />,
          },
          {
            path: "/orders",
            element: <OrderContainer />,
          },
          {
            path: "/tables",
            element: <RestaurantTablesContainer />,
          },
          {
            path: "/kpis",
            element: <Kpis />,
          },
          {
            path: "/tickets",
            element: <Tickets />,
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
    path: "/menu/:restaurantId/:locationId",
    element: <Menu />,
  },
  {
    path: "/otp",
    element: <OTPTable />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/open-menu",
    element: <SmartOrder />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
