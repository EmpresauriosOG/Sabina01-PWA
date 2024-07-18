import IngredientModal from "@/components/modals/IngredientModal";
import { DataTable } from "@/components/tables/DataTable";
import { columns } from "@/components/tables/Ingredients/IngredientColumn";
import { useIngredient } from "@/hooks/tanstack/useIngredient";
import { useFormSubmissionStore } from "@/shared/state/formSubmissionState";
import { useUserStore } from "@/shared/state/userState";
import { useEffect } from "react";

const Ingredients = () => {
  const { user } = useUserStore();
  const { data, isLoading, isError, refetch } = useIngredient(
    user?.restaurant_id
  );
  const ingredientFormSubmitted = useFormSubmissionStore(
    (state) => state.ingredientFormSubmitted
  );

  useEffect(() => {
    if (ingredientFormSubmitted) {
      refetch();
      useFormSubmissionStore.getState().setStaffFormSubmitted(false); // Optionally reset the flag after fetching
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientFormSubmitted]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    //Not sure if you need to move this styles @Braun
    <div className="container mx-auto py-10 bg-slate-700">
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
