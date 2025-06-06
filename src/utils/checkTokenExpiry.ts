import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: { exp: number } = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000); 
        return decoded.exp < now;
    } catch (e) {
        console.error("Failed to decode token", e);
        return true; 
    }
};
