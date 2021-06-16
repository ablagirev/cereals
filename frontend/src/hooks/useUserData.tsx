import { useQuery } from "react-query";
import { authService } from "../services";

const AUTH_DATA_QUERY_KEY = "AUTH_DATA_QUERY_KEY";

export const useUserData = (request: any) => {
  const result = useQuery<any>(
    AUTH_DATA_QUERY_KEY,
    () => authService.login(request),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return result;
};
