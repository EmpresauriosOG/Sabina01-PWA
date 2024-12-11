import { useSales } from "@/hooks/tanstack/getSales";
import { User } from "@/hooks/tanstack/getUser";
import { SalesChart } from "./SalesChart";

interface SalesChartProps {
  user: User;
}

const SalesChartContainer = (props: SalesChartProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useSales(
    user.restaurant_id,
    user.location_id
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    //Fix this color
    <div className="bg-slate-950 p-4 rounded-lg shadow-md">
      <SalesChart data={data ?? { date: "error", total_sales: 0 }} />
    </div>
  );
};

export default SalesChartContainer;
