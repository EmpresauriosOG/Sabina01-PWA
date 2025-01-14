import axios from "axios";

export const fetchChat = async (
  restaurantId: string,
  locationId: string,
  chatInput: string
) => {
  const options = {
    method: "POST",
    url: `https://sabina01.onrender.com/menu/rag/${restaurantId}/${locationId}/1/${chatInput}`,
  };
  const response = await axios.request(options);
  return response.data;
};
