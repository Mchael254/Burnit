import { useEffect, useState } from "react";
import { UserContext } from "../utils/profileContext";

import type { ReactNode } from "react";
import type { UserProfile } from "../types/authPayload";
import { getUserProfile } from "../services/auth/userProfile";


export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null | undefined>(undefined);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const profile = await getUserProfile();
                console.log("Fetched user profile:", profile); // ✅ Check this
                setUser(profile);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);



    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

