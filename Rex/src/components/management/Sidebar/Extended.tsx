import { Package2 } from "lucide-react";
import { Link } from "react-router-dom";
//Components
import { ModeToggle } from "@/components/mode-toggle";
//Data
import sidebarLinks from "../sidebarLinks";

const Extended = () => {
  return (
    <aside className="hidden md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Restaurant</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="flex flex-col text-sm font-light p-4 space-y-3">
            {sidebarLinks.map((item) => (
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                key={item.name}
                to={item.link}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
              <p>Dark Mode</p>
              <ModeToggle></ModeToggle>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Extended;
