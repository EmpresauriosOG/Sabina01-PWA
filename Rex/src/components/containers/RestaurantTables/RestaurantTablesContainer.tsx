import { useQueryTables } from "@/hooks/tanstack/queryTables";
import { useTickets } from "@/hooks/tanstack/useTickets";
import { useUserStore } from "@/shared/state/userState";
import { SectionLoader } from "@/components/ui/loading";
import RestaurantTables from "./RestaurantTables";
import { TablesResponse } from "@/utils/tablesUtils";
import { Ticket } from "@/utils/ticketUtils";

const RestaurantTablesContainer = () => {
  const { user } = useUserStore();
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQueryTables(user?.restaurant_id, user?.location_id);
  const { data: ticketsData } = useTickets(
    user?.restaurant_id ?? "",
    user?.location_id ?? ""
  );
  const tickets: Ticket[] = ticketsData?.tickets ?? [];

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
      tickets={tickets}
    />
  );
};

export default RestaurantTablesContainer;
