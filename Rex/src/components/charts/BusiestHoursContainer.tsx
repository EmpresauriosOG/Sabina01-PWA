import { useBusiestHours } from "@/hooks/tanstack/getBusiestHours";
import { User } from "@/hooks/tanstack/getUser";
import { BusiestHoursChart } from "./BusiestHoursChart";

interface BusiestHoursContainerProps {
  user: User;
}

const BusiestHoursContainer = (props: BusiestHoursContainerProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useBusiestHours(user.restaurant_id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!data?.data) {
    return <div>No data available</div>;
  }

  return (
    <div className="bg-neutral-900/60 p-4 rounded-lg shadow-md">
      <BusiestHoursChart data={data.data} />
    </div>
  );
};

export default BusiestHoursContainer;