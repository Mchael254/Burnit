import axios from "axios";
import { getToken } from "../../utils/token";
import { redirectToLogin } from "../../utils/redirect";
import type { CreateContactPayload } from "../../types/contact";



const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const createContact = async (contactPayload: CreateContactPayload) => {
    const token = getToken();
    console.log(token);
    if (!token) {
        redirectToLogin();
    }

    try {
        const response = await axios.post(`${BASE_URL}/users/contacts`, contactPayload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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