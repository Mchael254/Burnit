import axios from "axios";
import type { CreateWalletPayload } from "../../types/wallet";
import { getToken} from "../../utils/token";
import { redirectToLogin } from "../../utils/redirect";
import { isTokenExpired } from "../../utils/checkTokenExpiry";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const createWalletApi = async (walletPayload: CreateWalletPayload) => {
    const token = getToken();
    console.log(token);
    if (!token || isTokenExpired(token)) {
        redirectToLogin();
    }

    try {
        const response = await axios.post(`${BASE_URL}/users/wallets`, walletPayload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }

        });
        console.log(response.data);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Login failed";
            throw new Error(message);
        } else {
            throw new Error("Something went wrong");
        }

    }

}