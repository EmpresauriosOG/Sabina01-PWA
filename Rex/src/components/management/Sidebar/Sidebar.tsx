import Extended from "./Extended.tsx";
import MobileSidebar from "./MobileSidebar.tsx";

export default function Sidebar() {
  return (
    <>
      {/* Extended sidebar */}
      <Extended />
      {/* Mobile sidebar */}
      {/* <div className="flex flex-col"> */}
      <MobileSidebar />
    </>
  );
}
