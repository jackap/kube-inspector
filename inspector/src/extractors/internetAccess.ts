import axios from 'axios';

export const hasInternetAccess = async () => {
    const result = await axios.get('www.google.com');
    return result.status === 200 ? true:false
}