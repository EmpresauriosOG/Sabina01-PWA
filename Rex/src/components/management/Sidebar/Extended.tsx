import { CircleUserRound, Package2 } from "lucide-react";
import { Link } from "react-router-dom";
//Components
import { ModeToggle } from "@/components/mode-toggle";
//Data
import { getFilteredSidebarLinks } from "../sidebarLinks";
import { Button } from "@/components/ui/button";
//Hook
import { useUserStore } from "@/shared/state/userState";
import { useClerk } from "@clerk/clerk-react";

const Extended = () => {
  const { user, getRoles, setUser } = useUserStore();
  const roles = getRoles();
  console.log("user:", user);
  console.log("roles:", roles);
  const { signOut } = useClerk();
  return (
    <aside className="hidden md:block dark:bg-neutral-900 shadow-md rounded-md ml-2 my-4">
      <div className="flex flex-col gap-2">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Restaurante</span>
          </Link>
        </div>
        {user && (
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <CircleUserRound className="h-6 w-6" />
              <span className="">{user.first_name}</span>
            </Link>
          </div>
        )}

        <div className="flex">
          <nav className="flex flex-col text-sm font-light p-2 space-y-3">
            {getFilteredSidebarLinks(roles ?? []).map((item) => (
                <Link
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted  shadow-md rounded-md "
                  key={item.name}
                  to={item.path}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
              <p>Modo Oscuro</p>
              <ModeToggle></ModeToggle>
            </div>
          </nav>
        </div>
        {user && (
          <Button
            className="self-center m-4"
            onClick={() => {
              setUser(null);
              signOut({ redirectUrl: "/" });
            }}
          >
            Cerrar sesion
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Extended;
