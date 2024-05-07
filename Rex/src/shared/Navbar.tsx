import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link } from "react-router-dom";
import sabinaImage from "../assets/images/sabina.png";

const Navbar = () => {
  const { isAuthenticated, user } = useKindeAuth();

  return (
    <nav
      className=" flex justify-between bg-zinc-950 fixed z-50 
      w-full gap-5 p-6 sm:px-12"
    >
      <Link className="flex items-center gap-2" to={"/"}>
        <img src={sabinaImage} width={30} height={30} alt="Sabina" />
        <p className="max-sm:hidden">
          Sabina
          <span>Managment</span>
        </p>
      </Link>
      <div className="flex justify-between gap-5">
        {!isAuthenticated && <Button>Log In</Button>}
        {isAuthenticated && <p>{user?.given_name}</p>}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
