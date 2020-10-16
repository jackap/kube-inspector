import axios from "axios";

export const hasInternetAccess = async (): Promise<boolean> => {
  try {
    const result = await axios.get("http://www.google.com");
    return result.status === 200;
  } catch (e) {
    console.log(e);
    return false;
  }
};
