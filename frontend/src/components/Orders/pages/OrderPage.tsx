import { FieldArray, Form, Formik } from "formik";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  useOffer,
  useOfferCreate,
  useOfferDelete,
  useOfferEdit,
} from "../../../hooks/useOffers";
import { useProductEdit, useProducts } from "../../../hooks/useProducts";
import { useWarehouses } from "../../../hooks/useWarehouses";
import { routes } from "../../../routes/consts";
import { IProductSpecs } from "../../../services/models";
import { Button, Flex, Input, Spacer, Typography } from "../../../uikit";
import { FormikField } from "../../../uikit/Field";
import { Select } from "../../../uikit/Selects";
import { BLANK_CHAR, EMPTY_CHAR } from "../../../utils/consts";
import { IRouteParams } from "../../../utils/models";
import { DatePickerField } from "../../../uikit/Datepicker/Datepicker";
import Modal from "react-bootstrap/esm/Modal";
import { Loader } from "../../../uikit/Loader";
import isNumber from "lodash-es/isNumber";
import { Tooltip } from "../../../uikit/Tooltip";
import { PushContext } from "../../../context";
import * as Yup from "yup";
import { useOrder } from "../../../hooks/useOrder";
import { Table } from "../../../uikit/Table/Table";
import { formatDate, formatMoney, getTrimText } from "../../../utils/utils";

export const OrderPage: React.FC = () => {
  const { id: paramId }: IRouteParams = useParams();
  const history = useHistory();
  const pushContext = React.useContext(PushContext);
  const { data: orderData, isFetching, refetch } = useOrder(paramId);
  const {
    cost,
    costWithNds,
    offer,
    taxType,
    customerCost,
    customerCostWithNds,
    totalWithNds,
    priceForDelivery,
    selectedWarehouse,
    acceptedVolume,
    dateStartOfContract,
    dateFinishShipment,
    id: orderId,
  } = orderData || {};
  const { product, companyName, volume } = offer || {};
  const [orderFormData, setOrderFormData] = useState<any>();
  const [showModalState, setShowModalState] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  const handleModalOpen = (type: string) => {
    setModalType(type);
    setShowModalState(true);
  };

  const handleModalClose = () => {
    setModalType(null);
    setShowModalState(false);
  };

  const handleSubmitForm = (values: any) => {
    setOrderFormData({
      ...values,
    });
  };

  const getDaysToExpiration = (date: string) => {
    const endDate = new Date(date);
    return (
      Math.round(
        (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const renderModal = () => {
    const dataList = offer?.specifications?.map((item) => {
      const { name, description, unitOfMeasurement, spec } =
        item?.specification || {};
      const { max, min } = (spec && JSON.parse(spec)) || {};

      const getValues = () => {
        return min && max
          ? `${min} - ${max}`
          : !min
          ? `≤ ${max}`
          : !max
          ? `≥
         ${min}`
          : null;
      };
      return {
        title: name,
        content: [description || `${getValues()}${unitOfMeasurement?.unit}`],
      };
    });

    return (
      <StyledModal
        show={showModalState}
        onHide={handleModalClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton />
        <ModalContent>
          <Flex column>
            {modalType === "seller" ? (
              <>
                <Flex column vAlignContent="center" hAlignContent="center">
                  <Typography bold size="lg">
                    Продавец
                  </Typography>
                </Flex>
                <Spacer space={16} />
                <Flex column>
                  <Typography bold size="md">
                    {companyName}
                  </Typography>
                  <Spacer space={16} />
                  <Typography size="sm" color="#918F88">
                    <Flex column>
                      <span>fio</span>
                      <Spacer space={16} />
                      <span>inn</span>
                      <Spacer space={16} />
                      <span>address</span>
                    </Flex>
                  </Typography>
                </Flex>
              </>
            ) : modalType === "harvest" ? (
              <>
                <Flex column vAlignContent="center" hAlignContent="center">
                  <Typography bold size="lg">
                    Культура
                  </Typography>
                </Flex>
                <Spacer space={16} />
                <Flex column>
                  {!!dataList?.length && (
                    <Table
                      data={[
                        {
                          title: (
                            <>
                              <Typography bold size="lg">
                                {getTrimText(
                                  `${product?.title} ${product?.harvestType}${
                                    product?.harvestYear && ", "
                                  } ${
                                    product?.harvestYear &&
                                    formatDate(product?.harvestYear)
                                  }`
                                )}
                              </Typography>
                              <Spacer />
                            </>
                          ),
                          content: [],
                        },
                        ...dataList,
                      ]}
                    />
                  )}
                </Flex>
              </>
            ) : null}
            <Spacer space={24} />
            <StyledButton variant="link" onClick={handleModalClose}>
              Закрыть
            </StyledButton>
          </Flex>
        </ModalContent>
      </StyledModal>
    );
  };

  const tableHeader = [
    {
      title: "Суммарный объем",
      value: volume,
    },
    {
      title: "Погружено",
      value: acceptedVolume,
    },
    {
      title: "Осталось отгрузить",
      value: volume && acceptedVolume && volume - acceptedVolume,
    },
  ];

  const tableData = [
    {
      title: "Сделка",
      content: [
        <Flex>
          <span>{totalWithNds && formatMoney(totalWithNds)}</span>
          <Spacer width={18} />
          <TaxPresence>без НДС</TaxPresence>
        </Flex>,
      ],
    },
    {
      title: "Культура",
      content: [
        <StyledButton variant="link" onClick={() => handleModalOpen("harvest")}>
          {getTrimText(
            `${product?.title} ${product?.harvestType}${
              product?.harvestYear && ", "
            } ${product?.harvestYear && formatDate(product?.harvestYear)}`
          )}
        </StyledButton>,
      ],
    },
    {
      title: "Продавец",
      content: [
        <StyledButton variant="link" onClick={() => handleModalOpen("seller")}>
          {companyName}
        </StyledButton>,
      ],
    },
    {
      title: "Система налогообложения",
      content: [taxType],
    },
    {
      title: "Цена продавца, руб",
      content: [
        <Flex>
          <span>{cost && formatMoney(cost)}</span>
          <Spacer width={18} />
          <TaxPresence>без НДС / CNEXW</TaxPresence>
        </Flex>,
        <Flex>
          <span>{costWithNds && formatMoney(costWithNds)}</span>
          <Spacer width={18} />
          <TaxPresence>с НДС / CVEXW</TaxPresence>
        </Flex>,
      ],
    },
    {
      title: "Расчетная цена за транспорт, руб",
      content: [
        <Flex>
          <span>{priceForDelivery && formatMoney(priceForDelivery)}</span>
          <Spacer width={18} />
          <TaxPresence>без НДС / CNTP</TaxPresence>
        </Flex>,
      ],
    },
    {
      title: "Цена покупателя, руб",
      content: [
        <Flex>
          <span>{customerCost && formatMoney(customerCost)}</span>
          <Spacer width={18} />
          <TaxPresence>без НДС / CNCPT</TaxPresence>
        </Flex>,
        <Flex>
          <span>{customerCostWithNds && formatMoney(customerCostWithNds)}</span>
          <Spacer width={18} />
          <TaxPresence>с НДС / CVCPT</TaxPresence>
        </Flex>,
      ],
    },
    {
      title: "Адрес вывоза",
      content: [selectedWarehouse?.address],
    },
    {
      title: "Срок окончания контракта",
      content: [dateFinishShipment && getDaysToExpiration(dateFinishShipment)],
    },
  ];

  return isFetching ? (
    <Loader />
  ) : (
    <Flex column>
      <Heading size="lg2" bold>
        <Typography size="sm" color="#918F88">
          {dateStartOfContract && formatDate(dateStartOfContract)}
        </Typography>
        <Spacer space={8} />
        {`#${orderId} ${product?.title}`}
      </Heading>
      <OrderWrapper>
        <Table data={tableData} headerData={tableHeader} />
      </OrderWrapper>
      {renderModal()}
    </Flex>
  );
};

const StyledButton = styled(Button)`
  padding: 0;
  color: #407ef5;
  height: initial;
`;

const OrderWrapper = styled.div`
  max-width: 660px;
  padding: 44px;
`;

const StyledModal = styled(Modal)`
  .modal-header {
    border: none;
  }

  .modal-content {
    background-color: transparent;
    border: none;
  }
  .close {
    color: #f9f6ed;
    text-shadow: none;
    opacity: 1;
    position: absolute;
    right: -20px;
    top: 0px;
  }
`;

const ModalContent = styled.div`
  padding: 47px;
  background-color: #f9f6ed;
  border-radius: 10px;
`;

const Heading = styled(Typography)`
  padding: 44px 0 0 44px;
`;

const TaxPresence = styled.div`
  font-weight: 700;
  font-size: 16px;
`;
