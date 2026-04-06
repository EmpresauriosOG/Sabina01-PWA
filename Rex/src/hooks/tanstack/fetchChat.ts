import axios from "axios";

export const fetchChat = async (
  locationId: string,
  chatInput: string
) => {
  const options = {
    method: "GET",
    url: `https://aiapi-production-fbc0.up.railway.app/ask/${locationId}/${chatInput}`,
  };
  const response = await axios.request(options);
  return response.data;
};
