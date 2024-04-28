import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
//Setup Routes
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//Anytime your app throws an error while rendering, loading data, or performing data mutations, React Router will catch it and render an error screen. Let's make our own error page.
import ErrorPage from "./shared/ErrorPage.tsx";
import Login from "./auth/Login.tsx";
import SignUp from "./auth/SignUp.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
