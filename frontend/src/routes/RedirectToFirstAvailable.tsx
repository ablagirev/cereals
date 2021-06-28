import React from "react";
import { Redirect } from "react-router";
import { usePermissions } from "../hooks";
import { hasPermissions } from "../utils";
import { TAppNavItem } from "./models";

/**
 * Модель свойств компонента.
 *
 * @prop {TPageNav} nav Конфигурация навигации для вычисления первого доступного роута.
 * @prop {boolean} [useLinkTo] Признак, показывающий использовать ли для редиректа
 * альтернативный путь (со строковыми параметрами) первого доступного элемента.
 */
interface IProps {
  nav: TAppNavItem[];
  useLinkTo?: boolean;
}

/**
 * Производит редирект на первый доступный роут из переданных в пропсы.
 */
export const RedirectToFirstAvailable: React.FC<IProps> = ({
  nav,
  useLinkTo,
}) => {
  const userPermissions = usePermissions();
  const firstAvailable = nav.find((item: TAppNavItem) =>
    hasPermissions(userPermissions, item.allowed)
  );

  return (
    <Redirect
      to={useLinkTo ? firstAvailable?.linkTo || "" : firstAvailable?.path || ""}
    />
  );
};
