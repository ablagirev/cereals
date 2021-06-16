import React from "react";
import { checkPermissions } from "../utils";

import { Route, RouteProps } from "react-router-dom";
import { NoPermissions } from "../components/Layout";
import { usePermissions } from "../hooks/usePermissions";
import { ICheckPermissions } from "../utils/models";

/**
 * Модель свойств защищенного роута.
 */
interface IProtectedRouteProps extends ICheckPermissions, RouteProps {}

/**
 * Компонент "Защищенного" роута с возможностью проверки
 * наличия доступа к указанному пути.
 */
export const ProtectedRoute: React.FC<IProtectedRouteProps> = (
  props: IProtectedRouteProps
) => {
  const userPermissions = usePermissions();
  const { allowed, enabled, ...restProps } = props;

  const isPermitted = checkPermissions(userPermissions, {
    enabled,
    allowed,
  });

  return isPermitted ? <Route {...restProps} /> : <NoPermissions />;
};
