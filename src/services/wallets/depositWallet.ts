import axios from "axios";
import { isTokenExpired } from "../../utils/checkTokenExpiry";
import { redirectToLogin } from "../../utils/redirect";
import { getToken } from "../../utils/token";
import type { DepositPayload } from "../../types/wallet";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const depositWallet = async (wallet_id: string, depositPayload: DepositPayload) => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
        redirectToLogin();
        return;
    }

    try {

        const response = await axios.post(`${BASE_URL}/users/wallets/deposit/${wallet_id}`, depositPayload, {

            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(response.data);
        return response.data;


    } catch (error) {
        if (axios.isAxiosError(error)) {
            const res = error.response?.data;
            console.log("Full error:", res);

            let message = "Contact creation failed";
            if (typeof res === 'string') {
                message = res;
            } else if (res) {
                message =
                    res.message ||
                    res.error ||
                    (Array.isArray(res.errors) ? res.errors.join(', ') : null) ||
                    message;
            }

            throw new Error(message);
        } else {
            throw new Error("Something went wrong");
        }


    }

}