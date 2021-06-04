import axios from "axios";

export const hasInternetAccess = async (): Promise<boolean> => {
  try {
    const result = await axios.get("http://www.google.com");
    // TODO: modify the return code
    return result.status < 400;
  } catch (e) {
    console.log(e);
    return false;
  }
};
