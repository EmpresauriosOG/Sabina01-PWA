import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./shared/Navbar";
import LeftSideBar from "./shared/LeftSideBar";

//ToDo: Stablish layout for Sidebar, Navbar, Footer, etc.
function RootLayout() {
    return (
        <div className="bg-rose-500  w-full">
            <Navbar />
            <div className="flex">
                <LeftSideBar />
                <section
                    className="flex min-h-screen flex-1 flex-col
      px-6 pb-6 pt-36 max-md:pb-14 sm:px-14"
                >
                    <div className="mx-auto w-full max-w-5xl">
                        {" "}
                        <Outlet />
                    </div>
                </section>
                RightSideBar
            </div>
        </div>
    );
}

export default RootLayout;
