import { columns } from "../tables/Staff/UserColumn";
import { DataTable } from "../tables/DataTable";
import { useStaff } from "@/hooks/tanstack/getStaff";
import { useUserStore } from "@/shared/state/userState";
import StaffModal from "../modals/StaffModal";
import { SectionLoader } from "@/components/ui/loading";

const Staff = () => {
  const { user } = useUserStore();
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useStaff(user?.restaurant_id, user?.location_id);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError) {
    return (
      <div className="w-full p-6 md:p-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          Error al cargar el personal.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 md:p-8">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-foreground">Personal</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona usuarios, roles y accesos del restaurante.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        filter="first_name"
        Modal={
          <StaffModal
            location_id={user?.location_id ?? ""}
            restaurant_id={user?.restaurant_id ?? ""}
          />
        }
      />
    </div>
  );
};

export default Staff;
