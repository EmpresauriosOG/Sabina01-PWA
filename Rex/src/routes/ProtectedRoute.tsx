import { Outlet } from "react-router-dom";
import { BotOff } from "lucide-react";
//Hooks
import { useUserStore } from "@/shared/state/userState";
import { LoginForm } from "@/components/forms/Form";
import ModalForm from "@/components/modals/ModalForm";
const ProtectedRoute = () => {
  const { user } = useUserStore();
  console.log(user);
  return (
    <>
      {!user && (
        <div className="h-full p-4">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted border rounded-lg h-full">
            <div
              className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
              x-chunk="dashboard-02-chunk-1"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  Sesion no iniciada
                </h3>
                <BotOff className="w-40 h-40" />
                <p className="text-sm text-muted-foreground">
                  Porfavor inicia sesion para continuar
                </p>
                <ModalForm
                  buttonTitle="Inicia Sesion"
                  dialogTitle="Bienvenido!"
                  dialogDescription="Recuerda utilizar las credenciales proporcionadas, cualquier problema reportarlo con el administrador."
                  form={<LoginForm />}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {user && <Outlet />}
    </>
  );
};

export default ProtectedRoute;
