import SalesChartContainer from "@/components/charts/SalesChartContainer";
import ItemSalesChartContainer from "@/components/charts/ItemSalesChartContainer";
import HighestSellingContainer  from "@/components/cards/HighestSellingContainer";
import AverageTicketContainer from "@/components/cards/AverageTicketContainer";
import { useUserStore } from "@/shared/state/userState";

//this is the big container for all kpis
const Kpis = () => {
  const { user } = useUserStore();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* this user && means that the user is logged in and not null, equivalent to if(user !== null) */}
      {user && (
        <>
          <HighestSellingContainer user={user} />
          <AverageTicketContainer user={user} />
          <HighestSellingContainer user={user} />
          <SalesChartContainer user={user} />
          <ItemSalesChartContainer user={user} />
          <SalesChartContainer user={user} />
          {/* Add other chart containers here */}
        </>
      )}
      {/* All the other charts go here */}
    </div>
  );
};

export default Kpis;
