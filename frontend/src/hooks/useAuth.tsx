import { useCallback, useEffect, useState } from "react";
import { EMPTY_CHAR } from "../utils/consts";
import { STORAGE_TOKEN_NAME } from "./consts";

export const useAuth = () => {
  // eslint-disable-next-line no-undef
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken: string | null, id: string | null) => {
    setToken(jwtToken);
    setUserId(id);

    // eslint-disable-next-line no-undef
    localStorage.setItem(
      STORAGE_TOKEN_NAME,
      JSON.stringify({ userId: id, token: jwtToken })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    // eslint-disable-next-line no-undef
    localStorage.removeItem(STORAGE_TOKEN_NAME);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const data: any = localStorage.getItem(STORAGE_TOKEN_NAME) || EMPTY_CHAR; // TODO: заменить any

    if (data && data.token) {
      login(data.token, data.userId);
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, userId, ready };
};
