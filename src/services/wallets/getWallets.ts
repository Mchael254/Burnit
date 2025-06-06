import axios from "axios";
import { getToken} from "../../utils/token";
import { isTokenExpired } from "../../utils/checkTokenExpiry";
import { redirectToLogin } from "../../utils/redirect";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getWallets = async () => {
    const token = getToken()
    if (!token || isTokenExpired(token)) {
        redirectToLogin();
    }

    try {
        const response = await axios.get(`${BASE_URL}/users/wallets`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "cannot get wallets";

            throw new Error(message);

        } else {
            throw new Error("Something went wrong");
        }

    }

}