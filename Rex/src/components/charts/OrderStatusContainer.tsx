import { useOrderStatus } from "@/hooks/tanstack/getOrderStatus";
import { User } from "@/hooks/tanstack/getUser";
import { OrderStatusChart } from "./OrderStatusChart";

interface OrderStatusChartContainerProps {
  user: User;
}

const OrderStatusChartContainer = (props: OrderStatusChartContainerProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useOrderStatus(user.restaurant_id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const statusData = data?.data || [];

  return (
    <div className="bg-neutral-900/60 p-4 rounded-lg shadow-md">
      <OrderStatusChart data={statusData} />
    </div>
  );
};

export default OrderStatusChartContainer;