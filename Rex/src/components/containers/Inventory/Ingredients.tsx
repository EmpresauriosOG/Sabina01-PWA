import IngredientModal from "@/components/modals/IngredientModal";
import { DataTable } from "@/components/tables/DataTable";
import { columns } from "@/components/tables/Ingredients/IngredientColumn";
import { useIngredient } from "@/hooks/tanstack/useIngredient";
import { useUserStore } from "@/shared/state/userState";
import { SectionLoader } from "@/components/ui/loading";

const Ingredients = () => {
  const { user } = useUserStore();
  const { data, isLoading, isError } = useIngredient(
    user?.restaurant_id, user?.location_id
  );

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    //Not sure if you need to move this styles @Braun
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data?.ingredients ?? []}
        filter="name"
        Modal={
          <IngredientModal
            location_id={user?.location_id ?? ""}
            restaurant_id={user?.restaurant_id ?? ""}
          />
        }
      />
    </div>
  );
};

export default Ingredients;
