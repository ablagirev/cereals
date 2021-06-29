import React from "react";
import { generatePath, useHistory } from "react-router-dom";
import { useOrders } from "../../../hooks/useOrder";
import { routes } from "../../../routes/consts";
import { IOrder } from "../../../services/models";
import { Flex, Spacer, Tabs, Typography } from "../../../uikit";
import { Card } from "../../../uikit/Card/Card";
import { Table } from "../../../uikit/Table/Table";
import { ITab } from "../../../uikit/Tabs/Tabs";

export const OrdersListPage: React.FC = () => {
  const { data } = useOrders();
  const history = useHistory();
  const ordersData = data || [];

  const handleOrderClick = (id: string | number) => {
    history.push(generatePath(routes.orders.orderTimeline.path, { id }));
  };

  const renderOrderTab = (data: IOrder[]): ITab => {
    const status = data?.[0]?.status;
    const tab = {
      label: status && `${status} - ${data?.length}`,
      items: data?.map((item) => {
        const { title, id } = item || {};

        // TODO: разложить данные когда будет ендпоинт
        const dataList = [
          {
            title: "Продавец",
            content: [],
          },
          {
            title: "Налогообложение",
            content: [],
          },
          {
            title: "Сделка",
            content: [],
          },
          {
            title: "Цена продавца, руб",
            content: [],
          },
          {
            title: "Цена покупателя, руб",
            content: [],
          },
        ];
        return (
          <Card title={title} onClick={() => handleOrderClick(id)}>
            <Spacer space={30} />
            <Table data={dataList} />
          </Card>
        );
      }),
    };
    return tab;
  };

  const activeData = renderOrderTab(
    ordersData?.filter((el) => el.status === "active")
  );
  const finishedData = renderOrderTab(
    ordersData?.filter((el) => el.status === "finished")
  );
  const canceledData = renderOrderTab(
    ordersData?.filter((el) => el.status === "canceled")
  );

  return (
    <Flex column>
      <Typography size="lg2" bold>
        Сделки
      </Typography>
      <Spacer space={28} />
      <Tabs tabs={[activeData, finishedData, canceledData]} />
    </Flex>
  );
};
