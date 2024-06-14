import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// Components
import Sidebar from "./components/management/Sidebar/Sidebar";

function RootLayout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default RootLayout;
