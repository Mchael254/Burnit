import axios from "axios";
import { isTokenExpired } from "../../utils/checkTokenExpiry";
import { getToken } from "../../utils/token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
        throw new Error("Unauthorized");
    }

    try {
        const response = await axios.get(`${BASE_URL}/users/me/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data);
        
        return response.data;

    } catch (error) {
        console.error("Profile fetch error:", error);

        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get profile";
            throw new Error(message);
        } else {
            throw new Error("Unknown error");
        }
    }
};
