import React from "react";
import { generatePath, useHistory } from "react-router-dom";
import { useOrders } from "../../../hooks/useOrder";
import { routes } from "../../../routes/consts";
import { IOrder } from "../../../services/models";
import { Flex, Spacer, Tabs, Typography } from "../../../uikit";
import { Card } from "../../../uikit/Card/Card";
import { Table } from "../../../uikit/Table/Table";
import { ITab } from "../../../uikit/Tabs/Tabs";
import { Loader } from "../../../uikit/Loader";
import styled from "styled-components";
import { formatMoney, getTrimText } from "../../../utils/utils";
import { theme } from "../../../theme";
import { EMPTY_CHAR } from "../../../utils/consts";

const getStatusName = (statusCode: string) => {
  switch (statusCode) {
    case "active":
      return "Активные";
    case "finished":
      return "Завершенные";
    case "failed":
      return "Аннулированные";
    default:
      return EMPTY_CHAR;
  }
};

const getOrderStatusName = (statusCode: string) => {
  switch (statusCode) {
    case "active":
      return "Сделка создана";
    case "archived":
      return "Сделка завершена";
    case "accepted":
      return "Сделка принята";
    case "pending":
      return "Сделка в процессе";
    case "partial":
      return "Сделка частично завершена";
    default:
      return EMPTY_CHAR;
  }
};

export const OrdersListPage: React.FC = () => {
  const { data, isFetching } = useOrders();
  const history = useHistory();
  const ordersData = data || [];

  const handleOrderClick = (id: string | number) => {
    history.push(generatePath(routes.orders.timeline.path, { id }));
  };

  const renderOrderTab = (data: IOrder[]): ITab => {
    const statusName = getStatusName(data?.[0]?.status);
    const tab = {
      label: statusName && `${statusName} - ${data?.length}`,
      items: data?.map((item) => {
        const {
          title,
          offer,
          acceptedVolume,
          cost,
          costWithNds,
          taxType,
          id,
          customerCost,
          customerCostWithNds,
        } = item || {};

        const { status, companyName } = offer || {};

        const dataList = [
          {
            title: "Продавец",
            content: [companyName],
          },
          {
            title: "Налогообложение",
            content: [taxType],
          },
          {
            title: "Сделка",
            content: [
              <Flex>
                <span>{formatMoney(offer?.cost)}</span>
                <Spacer width={18} />
                <TaxPresence>без НДС</TaxPresence>
              </Flex>,
              <Flex>
                <span>{formatMoney(offer?.costWithNds)}</span>
                <Spacer width={18} />
                <TaxPresence>с НДС</TaxPresence>
              </Flex>,
            ],
          },
          {
            title: "Цена продавца, руб",
            content: [
              <Flex>
                <span>{formatMoney(cost)}</span>
                <Spacer width={18} />
                <TaxPresence>без НДС / CNEXW</TaxPresence>
              </Flex>,
              <Flex>
                <span>{formatMoney(costWithNds)}</span>
                <Spacer width={18} />
                <TaxPresence>с НДС / CVEXW</TaxPresence>
              </Flex>,
            ],
          },
          {
            title: "Цена покупателя, руб",
            content: [
              <Flex>
                <span>{formatMoney(customerCost)}</span>
                <Spacer width={18} />
                <TaxPresence>без НДС / CNCPT</TaxPresence>
              </Flex>,
              <Flex>
                <span>{formatMoney(customerCostWithNds)}</span>
                <Spacer width={18} />
                <TaxPresence>с НДС / CVCPT</TaxPresence>
              </Flex>,
            ],
          },
        ];
        return (
          <Card
            title={getTrimText(`#${id} ${title} ${acceptedVolume} т`)}
            onClick={() => handleOrderClick(id)}
            statusText={
              <Typography size="sm" color={theme.palette.common.colors.purple}>
                {getOrderStatusName(status)}
              </Typography>
            }
          >
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
    ordersData?.filter((el) => el.status === "cancelled")
  );

  return isFetching ? (
    <Loader />
  ) : (
    <Wrapper>
      <Flex column>
        <Typography size="lg2" bold>
          Сделки
        </Typography>
        <Spacer space={28} />
        <Tabs tabs={[activeData, finishedData, canceledData]} />
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 44px;
`;

const TaxPresence = styled.div`
  font-weight: 700;
  font-size: 16px;
`;

{
  /* TODO: фейк компонент экспанда для теста */
}
// <Typography size="lg2" bold>
//   <Accordion>
//     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//       Accordion 1
//     </AccordionSummary>
//     <AccordionDetails>
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
//       malesuada lacus ex, sit amet blandit leo lobortis eget.
//     </AccordionDetails>
//   </Accordion>
// </Typography>
