import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchOTP = async (restaurantId: string) => {
    console.log(restaurantId);
    const options = {
        method: "GET",
        url: "https://weatherapi-com.p.rapidapi.com/current.json",
        params: { q: "london" },
        headers: {
            "X-RapidAPI-Key":
                "35a885e9acmsh103b1ffe15f0ac1p102ed8jsn7e74708e0a0f",
            "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
    };

    const response = await axios.request(options);
    return response.data;
};

export const useOTP = (restaurantId: string) => {
    return useQuery({
        queryKey: ["weather", restaurantId],
        queryFn: () => fetchOTP(restaurantId),
    });
};
