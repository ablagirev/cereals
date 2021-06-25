import { useContext } from "react";
import { AuthContext } from "../context";

/**
 * Хук-посредник, позволяющий получить AuthContext.
 */
export const useAuthContext = () => useContext(AuthContext);
