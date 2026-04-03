import { useQueryTables } from "@/hooks/tanstack/queryTables";
import { useUserStore } from "@/shared/state/userState";
import { SectionLoader } from "@/components/ui/loading";
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
  if (isLoading) {
    return <SectionLoader />;
  }
  if (isError) {
    return <div>Error</div>;
  }
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
