import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { hasPermissions } from "../utils";
import { usePermissions } from "../hooks/usePermissions";
import { routes } from "./consts";
import { TAppNavItem } from "./models";

import { navigation } from "./navigation";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthPage } from "../components/Auth";
import { useAuthContext } from "../hooks/useAuthContext";

/**
 * Возвращает первый доступный пользователю роут карты.
 *
 * @param {string[]} userPermissions Разрешения текущего пользователя.
 */
const getFirstAvailableRoute = (userPermissions: string[]) => {
  const availableRoute = navigation.items.find((item: TAppNavItem) =>
    hasPermissions(userPermissions, item.allowed)
  );

  if (availableRoute) {
    return availableRoute.path;
  }

  return "/";
};

/**
 * Формирует список доступных корневых роутов приложения.
 */
const buildRoutes = () => {
  const routesToBuild: React.ReactNodeArray = [];
  const getProtectedRoute = (navItem: TAppNavItem) => (
    <ProtectedRoute
      enabled={navItem.enabled}
      allowed={navItem.allowed}
      exact={navItem.route.exact}
      key={navItem.path}
      path={navItem.path}
      render={navItem.route.render}
    />
  );

  navigation.items.forEach((item: TAppNavItem) => {
    routesToBuild.push(getProtectedRoute(item));

    if (item.children) {
      item.children.forEach((childItem: TAppNavItem) => {
        routesToBuild.push(getProtectedRoute(childItem));
      });
    }
  });

  return routesToBuild;
};

/**
 * Возвращает основную (корневую) карту роутов приложения.
 */
export const Routes: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const userPermissions = usePermissions();

  const redirectRoute = getFirstAvailableRoute(userPermissions);

  return isAuthenticated ? (
    <Switch>
      <Redirect exact from={routes.root.path} to={redirectRoute} />
      {buildRoutes()}
      <Route path="/*">
        <h3>Страница не найдена</h3>
      </Route>
    </Switch>
  ) : (
    <Switch>
      <Route path="/" component={AuthPage} exact />
      <Redirect to="/" />
    </Switch>
  );
};
