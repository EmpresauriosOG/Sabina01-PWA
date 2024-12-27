import SalesChartContainer from "@/components/charts/SalesChartContainer";
import HighestSellingContainer  from "@/components/cards/HighestSellingContainer";
import AverageTicketContainer from "@/components/cards/AverageTicketContainer";
import AverageOrderTimesContainer from "@/components/cards/AverageOrderTimesContainer";
import BusiestHoursContainer from "@/components/charts/BusiestHoursContainer";
import ItemsChartContainer from "@/components/charts/ItemsChartContainer";
import OrderStatusContainer from "@/components/charts/OrderStatusContainer";
import { useUserStore } from "@/shared/state/userState";

const Kpis = () => {
  const { user } = useUserStore();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {user && (
        <>
        <div className="col-span-full">
        <AverageOrderTimesContainer user={user} />
        </div>
          <HighestSellingContainer user={user} />
          <AverageTicketContainer user={user} />
          <SalesChartContainer user={user} />
          <BusiestHoursContainer user={user} />
          <ItemsChartContainer user={user} />
          <OrderStatusContainer user={user} />
        </>
      )}
    </div>
  );
};

export default Kpis;