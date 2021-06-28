import { useQuery, useQueryClient } from "react-query";
import { daylesfordService } from "../services";

const WAREHOUSE_LIST_DATA_QUERY_KEY = "WAREHOUSE_LIST_DATA_QUERY_KEY";

export const useWarehouses = () => {
  const queryClient = useQueryClient();
  const result = useQuery(
    WAREHOUSE_LIST_DATA_QUERY_KEY,
    () => daylesfordService.getWarehouses(),
    {
      enabled: !queryClient.getQueryData(WAREHOUSE_LIST_DATA_QUERY_KEY),
    }
  );

  return result;
};
