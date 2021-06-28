import { useQuery } from "react-query";
import { daylesfordService } from "../services";

const ORDER_LIST_DATA_QUERY_KEY = "ORDER_LIST_DATA_QUERY_KEY";

export const useOrders = () => {
  const result = useQuery(
    ORDER_LIST_DATA_QUERY_KEY,
    () => daylesfordService.getOrderList(),
    {
      enabled: true,
      retry: true,
    }
  );

  return result;
};
