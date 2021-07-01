import React from "react";
import { useCallback } from "react";
import { generatePath, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useOffers } from "../../../hooks/useOffers";
import { useWarehouses } from "../../../hooks/useWarehouses";
import { routes } from "../../../routes/consts";
import { IOffer } from "../../../services/models";
import { Button, Flex, Spacer, Tabs, Typography } from "../../../uikit";
import { Card } from "../../../uikit/Card/Card";
import { Loader } from "../../../uikit/Loader";
import { Table } from "../../../uikit/Table/Table";
import { ITab } from "../../../uikit/Tabs/Tabs";
import { EMPTY_CHAR } from "../../../utils/consts";
import { formatDate, formatMoney } from "../../../utils/utils";

// TODO: заменить на i18n
export const getStatus = (status: string) => {
  switch (status) {
    case "active":
      return "Активные";
    case "archive":
      return "Завершенные";
    default:
      return EMPTY_CHAR;
  }
};

export const OffersListPage: React.FC = () => {
  const { data, isFetching: isOffersFetching } = useOffers();
  const history = useHistory();
  const { data: warehouseData, isFetching: isWarehousesFetching } =
    useWarehouses();
  const offerData = data || [];

  const isFetching = isOffersFetching || isWarehousesFetching;

  const handleOfferClick = (id: string | number) => {
    history.push(generatePath(routes.offers.edit.path, { id }));
  };

  const handleCreateOffer = () => {
    history.push(generatePath(routes.offers.create.path));
  };

  const getWareHouseName = (warehouseId: number) =>
    warehouseData?.find((warehouse) => warehouse?.id === warehouseId)?.title;

  const renderOfferTab = useCallback(
    (data: IOffer[]): ITab => {
      const status = getStatus(data?.[0]?.status);
      const tab = {
        label: status && `${status} - ${data?.length}`,
        items: data?.map((item) => {
          const {
            title,
            volume,
            cost_with_NDS,
            cost,
            period_of_export,
            date_finish_shipment,
            date_start_shipment,
            warehouse,
            id,
          } = item || {};

          const periodOfShippment = `${formatDate(
            date_start_shipment
          )} — ${formatDate(date_finish_shipment)} (${period_of_export} д.)`;

          const dataList = [
            {
              title: "Объем, т",
              content: [volume],
            },
            {
              title: "Цена покупателя, руб",
              content: [
                <Flex>
                  <span>{formatMoney(cost)}</span>
                  <Spacer width={18} />
                  <TaxPresence>без НДС / CNCPT</TaxPresence>
                </Flex>,
                <Flex>
                  <span>{formatMoney(cost_with_NDS)}</span>
                  <Spacer width={18} />
                  <TaxPresence>с НДС / CVCPT</TaxPresence>
                </Flex>,
              ],
            },
            {
              title: "Период поставки",
              content: [periodOfShippment],
            },
            {
              title: "Порт",
              content: [getWareHouseName(warehouse?.id)],
            },
          ];
          return (
            <Card
              title={title}
              statusText={`#${id}`}
              onClick={() => handleOfferClick(id)}
            >
              <Spacer space={30} />
              <Table data={dataList} />
            </Card>
          );
        }),
      };
      return tab;
    },
    [warehouseData]
  );

  const activeData = renderOfferTab(
    offerData?.filter((el) => el.status === "active")
  );
  const archiveData = renderOfferTab(
    offerData?.filter((el) => el.status === "archive")
  );

  return isFetching ? (
    <Loader />
  ) : (
    <Wrapper>
      <Flex column>
        <Typography size="lg2" bold>
          Мои предложения
        </Typography>
        <Spacer space={28} />
        <Button variant="base" size="lg" onClick={handleCreateOffer}>
          Создать предложение
        </Button>
        <Spacer space={28} />
        <Tabs tabs={[activeData, archiveData]} />
      </Flex>
    </Wrapper>
  );
};

const TaxPresence = styled.div`
  font-weight: 700;
  font-size: 16px;
`;

const Wrapper = styled.div`
  padding: 44px;
`;
