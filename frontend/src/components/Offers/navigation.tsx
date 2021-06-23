import React from "react";
import { generatePath, Switch } from "react-router-dom";
import { routes } from "../../routes/consts";
import { TAppNavItem } from "../../routes/models";
import { ProtectedRoute } from "../../routes/ProtectedRoute";
import { RedirectToFirstAvailable } from "../../routes/RedirectToFirstAvailable";
import { IRouteParams } from "../../utils/models";
import { OfferPage } from "./pages/OfferPage";
import { OffersListPage } from "./pages/OffersListPage";

export const getDealingsNavigation = ({ id }: IRouteParams): TAppNavItem[] => [
  {
    allowed: [],
    path: routes.offers.list.path,
    route: {
      exact: true,
      render: () => <OffersListPage />,
    },
  },
  {
    allowed: [],
    path: routes.offers.create.path,
    route: {
      exact: true,
      render: () => <OfferPage />,
    },
  },
  {
    allowed: [],
    path: routes.offers.edit.path,
    linkTo: id
      ? generatePath(routes.offers.edit.path, { id })
      : routes.offers.list.path,
    route: {
      render: () => <OfferPage />,
    },
  },
];

export const getDealingsRoutes = ({ id }: IRouteParams) => {
  const dealingsNavigation = getDealingsNavigation({ id });

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
