import { DataTable } from "@/components/tables/DataTable";
import { columns } from "@/components/tables/Dishes/DishesColumn";
import { useMenu } from "@/hooks/tanstack/getMenu";
import { useUserStore } from "@/shared/state/userState";
import DishModal from "@/components/modals/DishesModal";
import { SectionLoader } from "@/components/ui/loading";

const Dishes = () => {
  const { user } = useUserStore();

  const { data, isLoading, isError, error } = useMenu(
    user?.restaurant_id || "NOT_FOUND",
    user?.location_id || "NOT_FOUND"
  );

  if (!user?.restaurant_id || !user?.location_id) {
    return <div>Missing restaurant or location information</div>;
  }

  if (isLoading) return <SectionLoader />;
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
