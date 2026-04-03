import { useQueryOrders } from "@/hooks/tanstack/queryOrders";
import { useUserStore } from "@/shared/state/userState";
import { SectionLoader } from "@/components/ui/loading";
import OrderBoard from "./OrderBoard";

const OrderContainer = () => {
  const { user } = useUserStore();
  const {
    data = [],
    isLoading,
    isError,
  } = useQueryOrders(user?.restaurant_id, user?.location_id);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError) {
    return <div>Error</div>;
  }
  return <OrderBoard data={data} />;
};

export default OrderContainer;
