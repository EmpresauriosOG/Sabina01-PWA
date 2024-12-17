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

  // Ensure we have an array of data, even if empty
  const salesData = data?.data || [];

  return (
    <div className="bg-neutral-900/60 p-4 rounded-lg shadow-md">
      <SalesChart data={salesData} />
    </div>
  );
};

export default SalesChartContainer;
