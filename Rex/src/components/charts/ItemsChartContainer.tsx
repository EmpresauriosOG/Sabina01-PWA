import { useItems } from "@/hooks/tanstack/getItems";
import { User } from "@/hooks/tanstack/getUser";
import { SectionLoader } from "@/components/ui/loading";
import { ItemsChart } from "./ItemsCharts";
interface ItemsChartContainerProps {
  user: User;
}

const ItemsChartContainer = (props: ItemsChartContainerProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useItems(user.restaurant_id);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const itemsData = data?.data || [];

  return (
    <div className="bg-neutral-900/60 p-4 rounded-lg shadow-md">
      <ItemsChart data={itemsData} />
    </div>
  );
};

export default ItemsChartContainer;