import React from "react";
import { DealingsPage } from "../components/Dealings";

import { routes } from "./consts";
import { TAppNavSection } from "./models";

export const navigation: TAppNavSection = {
  label: "Daylesford CRM",
  items: [
    {
      allowed: [],
      path: routes.dealings.path,
      route: {
        render: () => <DealingsPage />,
      },
      element: {
        label: "Сделки",
      },
    },
    {
      allowed: [],
      path: routes.offers.path,
      route: {
        render: () => <div>Страница предложений</div>,
      },
      element: {
        label: "Предложения",
      },
    },
    {
      allowed: [],
      path: routes.analytics.path,
      route: {
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
        render: () => <div>Страница настроек</div>,
      },
      element: {
        label: "Настройки",
      },
    },
  ],
};
