import { Outlet, useLocation } from "react-router-dom";
import { BotOff, ShieldX } from "lucide-react";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { useUserStore } from "@/shared/state/userState";
import { useEffect, useState } from "react";
import { fetchUser, User } from "@/hooks/tanstack/getUser";
import { Button } from "@/components/ui/button";
import { hasRouteAccess } from "@/auth/rolePolicy";
import { PageLoader } from "@/components/ui/loading";

const ProtectedRoute = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { setUser, getRoles } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.emailAddresses[0].emailAddress) {
          const userData = await fetchUser(user.emailAddresses[0].emailAddress);
          setUser(userData.user[0] as User);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    return (
      <div className="h-screen p-4 dark:bg-neutral-900">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted border rounded-lg h-full">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Sesion no iniciada
              </h3>
              <BotOff className="w-40 h-40" />
              <p className="text-sm text-muted-foreground">
                Porfavor inicia sesion para continuar
              </p>
              <SignInButton>
                <Button>Inicia sesion</Button>
              </SignInButton>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen p-4">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted border rounded-lg h-full">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">Error</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const roles = getRoles() ?? [];
  if (!hasRouteAccess(pathname, roles)) {
    return (
      <div className="h-screen p-4">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted border rounded-lg h-full">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldX className="w-20 h-20 text-muted-foreground" />
              <h3 className="text-2xl font-bold tracking-tight">
                Acceso denegado
              </h3>
              <p className="text-sm text-muted-foreground">
                No tienes permisos para acceder a esta pagina.
              </p>
              <Button onClick={() => window.history.back()}>Regresar</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
