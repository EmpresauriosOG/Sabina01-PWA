import SalesChartContainer from "@/components/charts/SalesChartContainer";
import { useUserStore } from "@/shared/state/userState";

//this is the big container for all kpis
const Kpis = () => {
  const { user } = useUserStore();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* this user && means that the user is logged in and not null, equivalent to if(user !== null) */}
      {user && (
        <>
          <SalesChartContainer user={user} />
          <SalesChartContainer user={user} />
          <SalesChartContainer user={user} />
          <SalesChartContainer user={user} />
          <SalesChartContainer user={user} />
          <SalesChartContainer user={user} />
          {/* Add other chart containers here */}
        </>
      )}
      {/* All the other charts go here */}
    </div>
  );
};

export default Kpis;
