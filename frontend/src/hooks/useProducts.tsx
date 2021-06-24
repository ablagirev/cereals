import { useQuery, useQueryClient } from "react-query";
import { daylesfordService } from "../services";

const PRODUCT_LIST_DATA_QUERY_KEY = "PRODUCT_LIST_DATA_QUERY_KEY";

export const useProducts = () => {
  const queryClient = useQueryClient();
  const result = useQuery(
    PRODUCT_LIST_DATA_QUERY_KEY,
    () => daylesfordService.getProducts(),
    {
      enabled: !queryClient.getQueryData(PRODUCT_LIST_DATA_QUERY_KEY),
    }
  );

  return result;
};
