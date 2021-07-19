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
import { formatDate, formatMoney } from "../../../utils/utils";

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
    id: orderId,
  } = orderData || {};
  const { product, companyName } = offer || {};
  const [orderFormData, setOrderFormData] = useState<any>();
  const [showModalState, setShowModalState] = useState(false);

  const handleCancel = () => {
    history.push(generatePath(routes.offers.list.path));
  };

  const handleModalOpen = () => {
    setShowModalState(true);
  };

  const handleModalClose = () => {
    setShowModalState(false);
  };

  const handleSubmitForm = (values: any) => {
    setOrderFormData({
      ...values,
    });
  };

  const renderModal = () => (
    <StyledModal
      show={showModalState}
      onHide={handleModalClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton />
      <ModalContent>
        <Flex column vAlignContent="center" hAlignContent="center">
          123
        </Flex>
      </ModalContent>
    </StyledModal>
  );

  const tableHeader = [
    {
      title: "test1",
      value: 123,
    },
    {
      title: "test1",
      value: 123,
    },
    {
      title: "test1",
      value: 123,
    },
  ];

  const tableData = [
    {
      title: "Сделка",
      content: [
        <Flex>
          {/* <span>{cost && formatMoney(cost)}</span> */}
          ????
          <Spacer width={18} />
          <TaxPresence>без НДС</TaxPresence>
        </Flex>,
      ],
    },
    {
      title: "Культура",
      content: [
        `${product?.title} ${product?.harvestType}, ${
          product?.harvestYear && formatDate(product?.harvestYear)
        }`,
      ],
    },
    {
      title: "Продавец",
      content: [companyName],
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
          <span>{cost && formatMoney(cost)}</span>
          <Spacer width={18} />
          <TaxPresence>без НДС / CNTP</TaxPresence>
        </Flex>,
        <Flex>
          <span>{costWithNds && formatMoney(costWithNds)}</span>
          <Spacer width={18} />
          <TaxPresence>с НДС / CVTP</TaxPresence>
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
      content: [],
    },
    {
      title: "Время до вывоза",
      content: [],
    },
  ];

  return isFetching ? (
    <Loader />
  ) : (
    <Flex column>
      <Heading size="lg2" bold>
        {`#${orderId} ${product?.title}`}
      </Heading>
      <Spacer space={28} />
      <OrderWrapper>
        <Table data={tableData} headerData={tableHeader} />
      </OrderWrapper>
      {renderModal()}
    </Flex>
  );
};

const OrderWrapper = styled.div`
  max-width: 600px;
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
