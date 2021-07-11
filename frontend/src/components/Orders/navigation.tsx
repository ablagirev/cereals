import React from "react";
import { generatePath, Switch } from "react-router-dom";
import { routes } from "../../routes/consts";
import { TAppNavItem } from "../../routes/models";
import { ProtectedRoute } from "../../routes/ProtectedRoute";
import { RedirectToFirstAvailable } from "../../routes/RedirectToFirstAvailable";
import { IRouteParams } from "../../utils/models";
import { OrderPage, OrdersListPage } from "./pages";

export const getOrdersNavigation = ({ id }: IRouteParams): TAppNavItem[] => [
  {
    allowed: [],
    path: routes.orders.list.path,
    route: {
      exact: true,
      render: () => <OrdersListPage />,
    },
  },
  {
    allowed: [],
    path: routes.orders.timeline.path,
    linkTo: id
      ? generatePath(routes.orders.timeline.path, { id })
      : routes.orders.list.path,
    route: {
      render: () => <OrderPage />,
    },
  },
];

export const getOrdersRoutes = ({ id }: IRouteParams) => {
  const ordersNavigation = getOrdersNavigation({ id });

  return (
    <Switch>
      {ordersNavigation.map((item: TAppNavItem) => (
        <ProtectedRoute
          allowed={item.allowed}
          key={item.path}
          exact={item.route.exact}
          path={item.path}
          render={item.route.render}
        />
      ))}
      <RedirectToFirstAvailable nav={ordersNavigation} />
    </Switch>
  );
};
