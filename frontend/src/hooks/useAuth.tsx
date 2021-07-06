import { useCallback, useEffect, useState } from "react";
import { EMPTY_CHAR } from "../utils/consts";
import { STORAGE_TOKEN_NAME, STORAGE_TOKEN_TYPE } from "./consts";
import { daylesfordService } from "../services";
import { useQuery } from "react-query";

const LOGIN_DATA_QUERY_KEY = "AUTH_DATA_QUERY_KEY";
const LOGOUT_DATA_QUERY_KEY = "AUTH_DATA_QUERY_KEY";

export const useAuth = () => {
  // eslint-disable-next-line no-undef
  const [token, setToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((token: string | null, type: string | null) => {
    setToken(token);
    setTokenType(type);

    // eslint-disable-next-line no-undef
    localStorage.setItem(STORAGE_TOKEN_NAME, token || EMPTY_CHAR);
    localStorage.setItem(STORAGE_TOKEN_TYPE, type || EMPTY_CHAR);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenType(null);
    // eslint-disable-next-line no-undef
    localStorage.removeItem(STORAGE_TOKEN_NAME);
    localStorage.removeItem(STORAGE_TOKEN_TYPE);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const tokenData: string =
      localStorage.getItem(STORAGE_TOKEN_NAME) || EMPTY_CHAR; // TODO: заменить any
    const tokenTypeData: string =
      localStorage.getItem(STORAGE_TOKEN_TYPE) || EMPTY_CHAR; // TODO: заменить any

    if (tokenData && tokenTypeData) {
      login(tokenData, tokenTypeData);
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, tokenType, ready };
};

export const useLogin = (request: any) => {
  const result = useQuery<any>(
    LOGIN_DATA_QUERY_KEY,
    () => daylesfordService.login(request),
    {
      enabled: !!request,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
    }
  );

  return result;
};

export const useLogout = () => {
  const result = useQuery<any>(
    LOGOUT_DATA_QUERY_KEY,
    () => daylesfordService.logout(),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
    }
  );

  return result;
};
