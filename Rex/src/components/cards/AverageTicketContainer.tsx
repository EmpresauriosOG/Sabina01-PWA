import { useAverageTicket } from "@/hooks/tanstack/getAverageTicket";
import { User } from "@/hooks/tanstack/getUser";
import { SectionLoader } from "@/components/ui/loading";
import { AverageTicketCard } from "./AverageTicketCard";

interface AverageTicketContainerProps {
  user: User;
}

const AverageTicketContainer = (props: AverageTicketContainerProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useAverageTicket(user.restaurant_id);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!data?.data) {
    return <div>No data available</div>;
  }

  return (
    <div className="bg-neutral-900/60 p-4 rounded-lg shadow-md">
      <AverageTicketCard data={data.data} />
    </div>
  );
};

export default AverageTicketContainer;
