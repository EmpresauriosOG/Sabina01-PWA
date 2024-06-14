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
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
// import Restaurants from "./components/containers/Restaurants.tsx";
import AdminDashboard from "./components/containers/AdminDashboard.tsx";
import Menu from "./components/Menu.tsx";
import Navbar from "./components/Navbar.tsx";
import OTPTable from "./components/menu/OTPTable.tsx";
import Tables from "./components/management/Tables.tsx";
import Sidebar from "./components/management/Sidebar/Sidebar.tsx";
//Context
import { ThemeProvider } from "./components/theme-provider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import Staff from "./components/containers/Staff.tsx";

const queryClient = new QueryClient();
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
            element: <AdminDashboard />,
          },
          {
            path: "/my-staff",
            element: <Staff />,
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
    path: "/sidebar",
    element: <Sidebar />,
  },
  // {
  //     path: "/:restaurantId",
  //     element: <Restaurants />,
  // },
  {
    path: "/menu",
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/menu/:restaurantId",
        element: <Menu />,
      },
    ],
  },
  {
    path: "/otp",
    element: <OTPTable />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/tables",
    element: <Tables />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
