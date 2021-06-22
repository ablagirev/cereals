import React from "react";
import { useOffers } from "../../../hooks/useOffers";
import { Flex, Spacer, Tabs, Typography } from "../../../uikit";
import { Card } from "../../../uikit/Card/Card";
import { Table } from "../../../uikit/Table/Table";

const dataMock = [
  {
    label: "Активные",
    items: [
      {
        title: "Пшеница 5 класс, урожай 2016",
        statusText: "Редактировать",
        list: [
          {
            title: "Продавец",
            content: ["ООО «ПРОДАЕМ УРОЖАЙ»"],
          },
        ],
      },
      {
        title: "Пшеница 5 класс, урожай 2016",
        statusText: "Редактировать",
        list: [
          {
            title: "Продавец",
            content: ["ООО «ПРОДАЕМ УРОЖАЙ»"],
          },
        ],
      },
    ],
  },
  {
    label: "Завершенные",
    items: [
      {
        title: "Пшеница 5 класс, урожай 2016",
        statusText: "Редактировать",
        list: [
          {
            title: "Сделка",
            content: ["6,245,000.00", "6,650,000.00"],
          },
        ],
      },
    ],
  },
];

export const OffersListPage: React.FC = () => {
  const { data } = useOffers();

  const tabs = dataMock.map((el) => {
    const cards = el.items.map(({ title, statusText, list }) => (
      <Card title={title} statusText={statusText}>
        <Spacer space={30} />
        <Table data={list} />
      </Card>
    ));

    return {
      ...el,
      items: cards,
    };
  });

  return (
    <Flex column>
      <Typography size="lg2" bold>
        Мои предложения
      </Typography>
      <Spacer space={28} />
      <Tabs tabs={tabs} />
    </Flex>
  );
};
