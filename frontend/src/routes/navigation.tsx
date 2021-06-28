import React from "react";
import { OffersPage } from "../components/Offers";

import { routes } from "./consts";
import { TAppNavSection } from "./models";

export const navigation: TAppNavSection = {
  label: "Daylesford CRM",
  items: [
    {
      allowed: [],
      path: routes.dealings.path,
      route: {
        exact: true,
        render: () => <div>Страница сделок</div>,
      },
      element: {
        label: "Сделки",
      },
    },
    {
      allowed: [],
      path: routes.offers.path,
      route: {
        render: () => <OffersPage />,
      },
      element: {
        label: "Предложения",
      },
    },
    {
      allowed: [],
      path: routes.analytics.path,
      route: {
        exact: true,
        render: () => <div>Страница аналитики</div>,
      },
      element: {
        label: "Аналитика",
      },
    },
    {
      allowed: [],
      path: routes.farmers.path,
      route: {
        exact: true,
        render: () => <div>Страница фермеров</div>,
      },
      element: {
        label: "Фермеры",
      },
    },
    {
      allowed: [],
      path: routes.settings.path,
      route: {
        exact: true,
        render: () => <div>Страница настроек</div>,
      },
      element: {
        label: "Настройки",
      },
    },
  ],
};
