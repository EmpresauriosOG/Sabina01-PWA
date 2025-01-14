import { useItemSales } from "@/hooks/tanstack/getItemSales";
import { User } from "@/hooks/tanstack/getUser";
import { ItemSalesChart } from "./ItemSalesChart";

interface ItemSalesChartProps {
  user: User;
}

const ItemSalesChartContainer = (props: ItemSalesChartProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useItemSales(
    user.restaurant_id,
    user.location_id
  );

  if (isLoading) {
    return (
      <div className="w-full h-[320px] bg-slate-950 p-4 rounded-lg shadow-md flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[320px] bg-slate-950 p-4 rounded-lg shadow-md flex items-center justify-center">
        Error
      </div>
    );
  }

  const salesData = data?.data || [];

  return (
    <div className="w-full min-h-[320px] bg-slate-950 p-4 rounded-lg shadow-md">
      <ItemSalesChart data={salesData} />
    </div>
  );
};

export default ItemSalesChartContainer;