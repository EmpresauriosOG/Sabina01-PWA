import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMenu = (restaurantId: string, locationId: string) => {
    return useQuery({
        queryKey: ["menu", restaurantId, locationId],
        queryFn: async () => {
            console.log(`Fetching menu for restaurant ${restaurantId} and location ${locationId}`);
            const response  = await axios.get(`https://sabina01.onrender.com/menu/${restaurantId}/${locationId}`);
            return response.data.menu
        },
    });
};
