import { columns } from "../tables/UserColumn";
import { DataTable } from "../tables/DataTable";
import { useStaff } from "@/hooks/tanstack/getStaff";
import { useUserStore } from "@/shared/state/userState";

const Staff = () => {
  const { user } = useUserStore();
  const {
    data = [],
    isLoading,
    isError,
  } = useStaff(user?.restaurant_id, user?.location_id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto py-10 bg-slate-500">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Staff;
