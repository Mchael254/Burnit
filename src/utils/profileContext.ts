import { createContext, type Dispatch, type SetStateAction } from "react";
import type { UserProfile } from "../types/authPayload";

type UserContextType = {
  user: UserProfile | null | undefined;
  setUser: Dispatch<SetStateAction<UserProfile | null | undefined>>;
};


export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

