import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import sabinaImage from "../assets/images/sabina.png";
import { useUserStore } from "./state/userState";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/forms/Form";

const Navbar = () => {
  const { user } = useUserStore();
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
        {!user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Inicia Sesion</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Bienvenido!</DialogTitle>
                <DialogDescription>
                  Recuerda utilizar las cerednciales proporcionadas, cualquier
                  problema reportarlo con el administrador.
                </DialogDescription>
              </DialogHeader>
              <LoginForm />
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {user && <p>{user?.email}</p>}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
