import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

// Components
import Sidebar from "./components/management/Sidebar/Sidebar";

function RootLayout() {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[170px_1fr]">
        <Sidebar />
        <Outlet />
      </div>
      <Toaster />
      <SonnerToaster position="top-right" richColors />
    </>
  );
}

export default RootLayout;
