import { useQueryTables } from "@/hooks/tanstack/queryTables";
import { useUserStore } from "@/shared/state/userState";
import RestaurantTables from "./RestaurantTables";
import { TablesResponse } from "@/utils/tablesUtils";

const RestaurantTablesContainer = () => {
  const { user } = useUserStore();
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQueryTables(user?.restaurant_id, user?.location_id);
  console.log(user);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  console.log("This is being passed", data);
  return (
    <RestaurantTables
      tableData={data as TablesResponse}
      restaurantId={user?.restaurant_id}
      locationId={user?.location_id}
      refetchTables={refetch}
    />
  );
};

export default RestaurantTablesContainer;
