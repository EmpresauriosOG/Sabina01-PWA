import { useAverageOrderTimes } from "@/hooks/tanstack/getAverageOrderTime";
import { User } from "@/hooks/tanstack/getUser";
import { AverageOrderTimesCard } from "./AverageOrderTimesCard";

interface AverageOrderTimesContainerProps {
  user: User;
}

const AverageOrderTimesContainer = (props: AverageOrderTimesContainerProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useAverageOrderTimes(user.restaurant_id);

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
      <AverageOrderTimesCard data={data.data} />
    </div>
  );
};

export default AverageOrderTimesContainer;
