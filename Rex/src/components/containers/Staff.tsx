import { columns } from "../tables/Staff/UserColumn";
import { DataTable } from "../tables/DataTable";
import { useStaff } from "@/hooks/tanstack/getStaff";
import { useUserStore } from "@/shared/state/userState";
import { useEffect } from "react";
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import StaffModal from "../modals/StaffModal";

const Staff = () => {
  const { user } = useUserStore();
  const staffFormSubmitted = useFormSubmissionStore(
    (state) => state.staffFormSubmitted
  );
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useStaff(user?.restaurant_id, user?.location_id);

  useEffect(() => {
    if (staffFormSubmitted) {
      refetch();
      useFormSubmissionStore.getState().setStaffFormSubmitted(false); // Optionally reset the flag after fetching
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffFormSubmitted]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    //Not sure if you need to move this styles @Braun
    <div className="container mx-auto py-10 bg-slate-500">
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
