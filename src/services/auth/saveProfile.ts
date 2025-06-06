import axios from "axios";
import { isTokenExpired } from "../../utils/checkTokenExpiry";
import { redirectToLogin } from "../../utils/redirect";
import { getToken } from "../../utils/token";
import type { SaveProfile } from "../../types/authPayload";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const saveProfile = async (updatePayload:SaveProfile) => {
    const token = getToken()
    if (!token || isTokenExpired(token)) {
        redirectToLogin();
    }

    try {

        const response = await axios.patch(`${BASE_URL}/users/me/profile`,updatePayload,{
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        })

        return response.data

    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "cannot get save profile";

            throw new Error(message);

        } else {
            throw new Error("Something went wrong");
        }

    }

}