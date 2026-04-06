import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import RootLayout from "./RootLayout";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./shared/ErrorPage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
import Menu from "./components/Menu";
import OTPTable from "./components/menu/OTPTable";
import Staff from "./components/containers/Staff";
import Inventory from "./components/containers/Inventory/Inventory";
import { ThemeProvider } from "./components/theme-provider";
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
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <SmartOrder />,
          },
          {
            path: "my-staff",
            element: <Staff />,
          },
          {
            path: "inventory",
            element: <Inventory />,
          },
          {
            path: "orders",
            element: <OrderContainer />,
          },
          {
            path: "tables",
            element: <RestaurantTablesContainer />,
          },
          {
            path: "kpis",
            element: <Kpis />,
          },
          {
            path: "tickets",
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

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing root element");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
);
