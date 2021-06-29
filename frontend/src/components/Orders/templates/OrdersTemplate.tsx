import React from "react";
import { useParams } from "react-router-dom";
import { IRouteParams } from "../../../utils/models";
import { getOrdersRoutes } from "../navigation";

export const OrdersTemplate: React.FC = () => {
  const { id }: IRouteParams = useParams() || {};
  return getOrdersRoutes({ id });
};
