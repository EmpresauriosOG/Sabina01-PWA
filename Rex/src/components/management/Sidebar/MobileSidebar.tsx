//Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";
//Icons
import { Menu, Search } from "lucide-react";
//Sidebar Links
import sidebarLinks from "../sidebarLinks";
//React
import { Link } from "react-router-dom";
import { useUserStore } from "@/shared/state/userState";
import { useClerk } from "@clerk/clerk-react";

const MobileSidebar = () => {
  const { user, getRoles, setUser } = useUserStore();
  const { signOut } = useClerk();
  const roles = getRoles();
  return (
    <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-sm font-light">
            {sidebarLinks
              .filter((item) =>
                item.roles.some((role) => roles?.includes(role))
              )
              .map((item) => (
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
              <p>Dark Mode!</p>
              <ModeToggle></ModeToggle>
            </div>
            {user && (
              <Button
                className="self-center m-4"
                onClick={() => {
                  signOut({ redirectUrl: "/" });
                  setUser(null);
                }}
              >
                Logout
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
    </header>
  );
};

export default MobileSidebar;
