import { useAverageTicket } from "@/hooks/tanstack/getAverageTicket";
import { User } from "@/hooks/tanstack/getUser";
import { AverageTicketCard } from "./AverageTicketCard";

interface AverageTicketContainerProps {
  user: User;
}

const AverageTicketContainer = (props: AverageTicketContainerProps) => {
  const { user } = props;
  const { data, isLoading, isError } = useAverageTicket(user.restaurant_id);

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
    <div className="bg-slate-950 p-4 rounded-lg shadow-md">
      <AverageTicketCard data={data.data} />
    </div>
  );
};

export default AverageTicketContainer;