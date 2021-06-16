import { createContext } from "react";

export interface IAuthContext {
    token: string | null,
    userId: string | null,
    login: (jwtToken: string | null, id: string | null) => void,
    logout: () => void,
    isAuthenticated: boolean,
}

export const AuthContext = createContext<IAuthContext>({
  token: '',
  userId: '',
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});