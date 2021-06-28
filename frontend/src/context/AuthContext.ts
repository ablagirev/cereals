import { createContext } from "react";

export interface IAuthContext {
    token: string | null,
    tokenType: string | null,
    login: (token: string | null, id: string | null) => void,
    logout: () => void,
    isAuthenticated: boolean,
}

export const AuthContext = createContext<IAuthContext>({
  token: '',
  tokenType: '',
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});