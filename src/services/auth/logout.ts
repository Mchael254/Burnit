import axios from "axios";
import type { logoutPayload } from "../../types/authPayload";
import { getToken } from "../../utils/token";
import { isTokenExpired } from "../../utils/checkTokenExpiry";
import { redirectToLogin } from "../../utils/redirect";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const userLogout = async (logoutPayload: logoutPayload) => {

    const token = getToken()
    if (!token || isTokenExpired(token)) {
        redirectToLogin();
    }

    try {
        const response = await axios.post(`${BASE_URL}/users/me/logout`, logoutPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }

        });
        console.log(response.data);

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Logout failed";
            throw new Error(message);
        } else {
            throw new Error("Something went wrong");
        }

    }

}