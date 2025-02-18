import { DataTable } from "@/components/tables/DataTable";
import { columns } from "@/components/tables/Dishes/DishesColumn";
import { useMenu } from "@/hooks/tanstack/getMenu";
import { useUserStore } from "@/shared/state/userState";
import { useEffect } from "react";
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import DishModal from "@/components/modals/DishesModal";

const Dishes = () => {
  const { user } = useUserStore();

  const { data, isLoading, isError, error, refetch } = useMenu(
    user?.restaurant_id || "NOT_FOUND",
    user?.location_id || "NOT_FOUND"
  );

  const dishFormSubmitted = useFormSubmissionStore(
    (state) => state.dishFormSubmitted
  );

  useEffect(() => {
    if (dishFormSubmitted) {
      refetch();
      useFormSubmissionStore.getState().setDishFormSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishFormSubmitted]);

  if (!user?.restaurant_id || !user?.location_id) {
    return <div>Missing restaurant or location information</div>;
  }

  if (isLoading) return <div>Loading menu items...</div>;
  if (isError) return <div>Error loading menu items: {error?.message}</div>;

  const menuItems = Array.isArray(data) ? data : [];

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={menuItems}
        filter="name"
        Modal={
          <DishModal
            location_id={user?.location_id ?? ""}
            restaurant_id={user?.restaurant_id ?? ""}
          />
        }
      />
    </div>
  );
};

export default Dishes;
