import { useHighestSelling } from "@/hooks/tanstack/getHighestSelling";
import { User } from "@/hooks/tanstack/getUser";
import { SectionLoader } from "@/components/ui/loading";
import { HighestSellingCard } from "./HighestSellingCard";

interface HighestSellingContainerProps {
  user: User;
}

const HighestSellingContainer = (props: HighestSellingContainerProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useHighestSelling(user.restaurant_id);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  // Ensure we have data before rendering
  if (!data?.data) {
    return <div>No data available</div>;
  }

  return (
    <div className="bg-neutral-900/60 p-4 rounded-lg shadow-md">
      <HighestSellingCard data={data.data} />
    </div>
  );
};

export default HighestSellingContainer;
