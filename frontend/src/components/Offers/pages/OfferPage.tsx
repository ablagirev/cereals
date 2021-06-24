import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  useOffer,
  useOfferCreate,
  useOfferEdit,
} from "../../../hooks/useOffers";
import { useProducts } from "../../../hooks/useProducts";
import { useWarehouses } from "../../../hooks/useWarehouses";
import { routes } from "../../../routes/consts";
import { Button, Flex, Input, Spacer, Typography } from "../../../uikit";
import { FormikField } from "../../../uikit/Field";
import { Select } from "../../../uikit/Selects";
import { IRouteParams } from "../../../utils/models";
import { DatePickerField } from "../../Datepicker/Datepicker";

export const OfferPage: React.FC = () => {
  const { id: paramId }: IRouteParams = useParams();
  const history = useHistory();
  const { data: productsData } = useProducts();
  const { data: warehouseData } = useWarehouses();
  const { data: initialOfferData } = useOffer(paramId);
  const [formData, setFormData] = useState();

  const productOptions = useMemo(() => {
    return (
      productsData?.map((product) => {
        const { title, id } = product || {};
        return {
          value: id,
          label: title,
        };
      }) || []
    );
  }, [productsData]);

  const warehouseOptions = useMemo(() => {
    return (
      warehouseData?.map((warehouse) => {
        const { title, id } = warehouse || {};
        return {
          value: id,
          label: title,
        };
      }) || []
    );
  }, [warehouseData]);

  const {
    date_finish_shipment,
    date_start_shipment,
    volume,
    cost_with_NDS,
    product: offerProduct,
    warehouse: offerWarehouse,
  } = initialOfferData || {};

  const { isSuccess: isEditSuccess, refetch: refetchOfferEdit } =
    useOfferEdit(formData);
  const { isSuccess: isCreateSuccess, refetch: refetchOfferCreate } =
    useOfferCreate(formData);

  const handleSubmit = (values: any) => {
    const { product, warehouse } = values || {};
    setFormData({
      ...values,
      product: product?.value,
      warehouse: warehouse?.value,
      paramId,
    });
  };

  useEffect(() => {
    paramId ? refetchOfferEdit() : refetchOfferCreate();
  }, [formData]);

  useEffect(() => {
    formData &&
      (isEditSuccess || isCreateSuccess) &&
      history.push(generatePath(routes.offers.list.path));
  }, [isEditSuccess, isCreateSuccess, formData]);

  const initialValues = useMemo(() => {
    return {
      volume,
      cost_with_NDS, // TODO: уточнить должно ли отправляться с НДС или без
      product: productOptions?.find((option) => option?.value === offerProduct),
      warehouse: warehouseOptions?.find(
        (option) => option?.value === offerWarehouse
      ),
    };
  }, [initialOfferData, warehouseOptions, productOptions]);

  return (
    <Flex column>
      <Typography size="lg2" bold>
        {`${paramId ? "Редактировать" : "Создать"} предложение`}
      </Typography>
      <Spacer space={28} />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <StyledFlex>
            <Flex column>
              <FormikField name="product" title="Культура">
                <Select variant="light" options={productOptions} />
              </FormikField>
              <FormikField
                name="cost_with_NDS"
                title="Цена CNCPT на воротах порта, ₽/т"
              >
                <Input name="cost_with_NDS" />
              </FormikField>
              <FormikField name="volume" title="Объем, т">
                <Input name="volume" />
              </FormikField>
              <FormikField name="period_shipment" title="Период поставки">
                <DatePickerField
                  initialValues={{
                    start: date_start_shipment,
                    end: date_finish_shipment,
                  }}
                  startFieldName="date_start_shipment"
                  endFieldName="date_finish_shipment"
                  hasCounter
                />
              </FormikField>
              <FormikField name="warehouse" title="Порт">
                <Select options={warehouseOptions} />
              </FormikField>
            </Flex>
            <Indicators>asds</Indicators>
          </StyledFlex>
          <Button variant="base" type="submit">
            Отправить
          </Button>
          <Spacer />
        </Form>
      </Formik>
    </Flex>
  );
};

const StyledFlex = styled(Flex)`
  justify-content: space-between;
`;

const Indicators = styled.div``;
