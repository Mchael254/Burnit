import type { registerPayload } from "../../types/authPayload";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const registerUser = async (registerPayload: registerPayload) => {

    try {
        const response = await axios.post(`${BASE_URL}/register`, registerPayload, {
            headers: {
                'Content-Type': 'application/json'
            }

        });
        console.log(response.data);

        return response.data;


    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Registration failed";
            throw new Error(message);
        } else {
            throw new Error("Something went wrong");
        }

    }

}