import { useQueryOrders } from "@/hooks/tanstack/queryOrders";
import { useUserStore } from "@/shared/state/userState";
import OrderBoard from "./OrderBoard";

const OrderContainer = () => {
  const { user } = useUserStore();
  const {
    data = [],
    isLoading,
    isError,
  } = useQueryOrders(user?.restaurant_id, user?.location_id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }
  return <OrderBoard data={data} />;
};

export default OrderContainer;
