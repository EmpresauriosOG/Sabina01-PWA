import Extended from "./Extended";
import MobileSidebar from "./MobileSidebar";

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
