import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMenuByRestaurantID = async (restaurantId: string) => {
    console.log(restaurantId);
    const options = {
        method: "GET",
        url: `https://sabina01.onrender.com/menu/${restaurantId}`,
    };

    const response = await axios.request(options);
    return response.data;
};

export const useMenu = (restaurantId: string) => {
    return useQuery({
        queryKey: ["menu", restaurantId],
        queryFn: () => fetchMenuByRestaurantID(restaurantId),
        staleTime: 0,
    });
};
