import React from "react";
import { useQuery } from "react-query";
import { PushContext } from "../context";
import { daylesfordService } from "../services";
import { IOrder } from "../services/models";

const ORDER_LIST_DATA_QUERY_KEY = "ORDER_LIST_DATA_QUERY_KEY";
const ORDER_DATA_QUERY_KEY = "ORDER_DATA_QUERY_KEY";

export const useOrders = () => {
  const pushContext = React.useContext(PushContext);
  const result = useQuery(
    ORDER_LIST_DATA_QUERY_KEY,
    () => daylesfordService.getOrderList(),
    {
      enabled: true,
      retry: false,
      onError: (e: any) =>
        pushContext.setPushContext({
          text: `${e.message}: список сделок`,
          type: "error",
        }),
    }
  );

  return result;
};

export const useOrder = (id: string) => {
  const pushContext = React.useContext(PushContext);
  const result = useQuery<IOrder>(
    [ORDER_DATA_QUERY_KEY, id],
    () => daylesfordService.getOrder(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: false,
      onError: (e: any) =>
        pushContext.setPushContext({
          text: `${e.message}: данные сделки`,
          type: "error",
        }),
    }
  );

  return result;
};
