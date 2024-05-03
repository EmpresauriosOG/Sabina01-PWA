import { useWeather } from "@/hooks/tanstack/getMenu";
import { useParams } from "react-router-dom";

const Restaurants = () => {
  const { restaurantId } = useParams();
  const { data, isLoading, error } = useWeather(restaurantId || "NOT_FOUND");
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.location.name}</h1>
      <p>{data.current.condition.text}</p>
    </div>
  );
};

export default Restaurants;
