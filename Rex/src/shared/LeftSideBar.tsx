import { Button } from "@/components/ui/button";
import { sidebarLinks } from "./constants";
import { Link, useParams } from "react-router-dom";

const LeftSideBar = () => {
  const { pathname } = useParams();
  const isSignedOut = true;
  return (
    <aside
      className="custom-scrollbar sticky left-0  top-0 flex h-screen 
    flex-col justify-between overflow-y-auto border-slate-500 border-r p-6 pt-36
   shadow-lg shadow-red-950 max-sm:hidden lg:w-[266px]"
    >
      <div className="flex flex-1 flex-col gap-6">
        {" "}
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;
          return (
            <Link
              key={item.route}
              to={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-white"
                  : "text-dark300_light900"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <img
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${
                  isActive ? "base-bold text-white" : "base-medium text-white"
                } max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}{" "}
      </div>
      {isSignedOut && (
        <div className="flex flex-col gap-3">
          <Link to="/sign-in">
            <Button
              className="small-medium btn-secondary
                  min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
            >
              <img
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                {" "}
                Log In
              </span>
            </Button>
          </Link>

          <Link to="/sign-up">
            <Button
              className="small-medium light-border-2 btn-tertiary
                  text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 
                  shadow-none"
            >
              <img
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden"> Sign Up</span>
            </Button>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default LeftSideBar;
