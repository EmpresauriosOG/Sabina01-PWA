import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import hamburguerSvg from "../assets/icons/hamburger.svg";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "./constants";
import { Link, useParams } from "react-router-dom";

const NavContent = () => {
  const { pathname } = useParams();
  return (
    <section className="flex h-full flex-col gap-6 pt-16 bg-red-600">
      {sidebarLinks.map((item) => {
        // const isActive = pathname === item.route;
        const isActive = true;
        return (
          <SheetClose asChild key={item.route}>
            <Link
              to={item.route}
              className={`${
                isActive ? "rounded-lg text-white" : "text-slate-400"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <img
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  const isSignedOut = true;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <img
          src={hamburguerSvg}
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <Link className="flex items-center gap-1" to={"/"}>
          <img
            src="assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="DevFlow"
          />
          <p
            className="h2-bold text-dark100_light900
             font-spaceGrotesk"
          >
            Dev
            <span className="text-primary-500">Overflow</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
          {isSignedOut && (
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link to="/sign-in">
                  <Button
                    className="small-medium btn-secondary
                  min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                  >
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/sign-up">
                  <Button
                    className="small-medium light-border-2 btn-tertiary
                  text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 
                  shadow-none"
                  >
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
