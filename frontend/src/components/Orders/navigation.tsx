import React from "react";
import { generatePath, Switch } from "react-router-dom";
import { routes } from "../../routes/consts";
import { TAppNavItem } from "../../routes/models";
import { ProtectedRoute } from "../../routes/ProtectedRoute";
import { RedirectToFirstAvailable } from "../../routes/RedirectToFirstAvailable";
import { IRouteParams } from "../../utils/models";
import { OrdersListPage } from "./pages";

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
    path: routes.orders.orderTimeline.path,
    linkTo: id
      ? generatePath(routes.orders.orderTimeline.path, { id })
      : routes.orders.list.path,
    route: {
      render: () => <div>Страница предложения (таймлайн)</div>,
    },
  },
];

export const getOrdersRoutes = ({ id }: IRouteParams) => {
  const dealingsNavigation = getOrdersNavigation({ id });

  return (
    <Switch>
      {dealingsNavigation.map((item: TAppNavItem) => (
        <ProtectedRoute
          allowed={item.allowed}
          key={item.path}
          exact={item.route.exact}
          path={item.path}
          render={item.route.render}
        />
      ))}
      <RedirectToFirstAvailable nav={dealingsNavigation} />
    </Switch>
  );
};
