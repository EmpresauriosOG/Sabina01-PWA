import { useMenu } from "@/hooks/tanstack/getMenu";
import { useUserStore } from "@/shared/state/userState";
import { SectionLoader } from "@/components/ui/loading";
import AdminDashboard from "../AdminDashboard";

const SmartOrder = () => {
  const { user } = useUserStore();
  const { data, isLoading, isError } = useMenu(
    user?.restaurant_id || "NOT_FOUND",
    user?.location_id || "NOT_FOUND"
  );
  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError) {
    return <div>Error</div>;
  }
  return <AdminDashboard menu={data} />;
};

export default SmartOrder;
