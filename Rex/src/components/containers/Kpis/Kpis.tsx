import SalesChartContainer from "@/components/charts/SalesChartContainer";
// import ItemSalesChartContainer from "@/components/charts/ItemSalesChartContainer";
import HighestSellingContainer  from "@/components/cards/HighestSellingContainer";
import AverageTicketContainer from "@/components/cards/AverageTicketContainer";
import AverageOrderTimesContainer from "@/components/cards/AverageOrderTimesContainer";
import BusiestHoursContainer from "@/components/charts/BusiestHoursContainer";
import ItemsChartContainer from "@/components/charts/ItemsChartContainer";
import OrderStatusContainer from "@/components/charts/OrderStatusContainer";
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
          <AverageOrderTimesContainer user={user} />
          <SalesChartContainer user={user} />
          <BusiestHoursContainer user={user} />
          <ItemsChartContainer user={user} />
          <OrderStatusContainer user={user} />
          {/* Add other chart containers here */}
        </>
      )}
      {/* All the other charts go here */}
    </div>
  );
};

export default Kpis;
