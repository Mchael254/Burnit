import { useContext } from "react";
import { UserContext } from "../utils/profileContext";

export function useUser() {
  return useContext(UserContext);
}
