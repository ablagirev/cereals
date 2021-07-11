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
import { BLANK_CHAR, EMPTY_CHAR } from "../../../utils/consts";
import {
  formatDate,
  formatMoney,
  numberWithSeparators,
} from "../../../utils/utils";
import groupBy from "lodash-es/groupBy";

const getStatusName = (statusCode: string) => {
  switch (statusCode) {
    case "active":
    case "pending":
      return "Активные";
    case "archived":
    case "accepted":
    case "partial":
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
      const status = getStatusName(data?.[0]?.status);
      const tab = {
        label: status && `${status} - ${data?.length}`,
        items: data?.map((item) => {
          const {
            volume,
            costWithNds,
            cost,
            periodOfExport,
            dateFinishShipment,
            dateStartShipment,
            warehouse,
            product,
            id,
          } = item || {};

          const { harvestType, harvestYear, title } = product || {};

          const periodOfShippment = `${formatDate(
            dateStartShipment
          )} ${BLANK_CHAR} ${formatDate(
            dateFinishShipment
          )} (${periodOfExport} д.)`;

          const dataList = [
            {
              title: "Объем, т",
              content: [numberWithSeparators(volume)],
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
                  <span>{formatMoney(costWithNds)}</span>
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
              title={`${title} ${harvestType}, ${formatDate(harvestYear)}`}
              statusText={
                <Typography size="sm" color="#918F89">
                  {`#${id}`}
                </Typography>
              }
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

  const offerTabs = Object.entries(
    groupBy(offerData, (obj) => getStatusName(obj.status))
  ).map((offer) => {
    return renderOfferTab(offer[1]);
  });

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
        <Tabs tabs={offerTabs} />
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
