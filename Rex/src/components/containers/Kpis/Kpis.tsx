import SalesChartContainer from "@/components/charts/SalesChartContainer";
import { useUserStore } from "@/shared/state/userState";

//this is the big container for all kpis
const Kpis = () => {
  const { user } = useUserStore();
  return (
    <div>
      {/* this user && means that the user is logged in and not null, equivalent to if(user !== null) */}
      {user && <SalesChartContainer user={user} />}
      {/* All the other charts go here */}
    </div>
  );
};

export default Kpis;
