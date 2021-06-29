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
import { EMPTY_CHAR } from "../../../utils/consts";
import { IRouteParams } from "../../../utils/models";
import { DatePickerField } from "../../../uikit/Datepicker/Datepicker";

export const OfferPage: React.FC = () => {
  const { id: paramId }: IRouteParams = useParams();
  const history = useHistory();
  const { data: productsData } = useProducts();
  const { data: warehouseData } = useWarehouses();
  const { data: offerData } = useOffer(paramId);
  const [offerFormData, setOfferFormData] = useState();
  const [specificationsFormData, setSpecificationsFormData] =
    useState<IProductSpecs[]>();
  const [chosenProductId, setChosenProductId] = useState<number>();
  const [productSpecifications, setProductSpecifications] =
    useState<IProductSpecs[]>();
  const { isSuccess: isOfferEditSuccess, refetch: refetchOfferEdit } =
    useOfferEdit(offerFormData);

  const { isSuccess: isOfferDeleteSuccess, refetch: refetchOfferDelete } =
    useOfferDelete(paramId);

  const {
    date_finish_shipment,
    date_start_shipment,
    volume,
    cost,
    product: offerProduct,
    warehouse: offerWarehouse,
  } = offerData || {};

  const offerProductId = offerProduct?.id;
  const offerWarehouseId = offerWarehouse?.id;

  const { isSuccess: isProductEditSuccess, refetch: refetchProductEdit } =
    useProductEdit({
      id: chosenProductId || offerProductId,
      specifications: specificationsFormData,
    });
  const { isSuccess: isCreateSuccess, refetch: refetchOfferCreate } =
    useOfferCreate(offerFormData);
  const isEdit = !!paramId;

  const getProductSpecsById = (productId?: number) => {
    return (
      productsData?.find((product) => product.id === productId)
        ?.specifications || []
    );
  };

  const handleProductChange = (product: any) => {
    setChosenProductId(product.value);
  };

  const handleCancel = () => {
    history.push(generatePath(routes.offers.list.path));
  };

  const handleDelete = () => {
    refetchOfferDelete();
  };

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

  const getProduct = (productId?: number) =>
    productOptions?.find((option) => option?.value === productId);

  const actualProductId = useMemo(
    () => chosenProductId || offerProductId || productOptions?.[0]?.value,
    [chosenProductId, offerProductId, productOptions]
  );

  const initialValues = useMemo(() => {
    return {
      volume,
      cost, // TODO: уточнить должно ли отправляться с НДС или без
      product: getProduct(actualProductId),
      warehouse:
        warehouseOptions?.find(
          (option) => option?.value === offerWarehouseId
        ) || warehouseOptions?.[0],
      specifications: productSpecifications?.map((spec) => {
        const {
          max_value,
          min_value,
          unit_of_measurement,
          name_of_specification,
          id: specId,
        } = spec;
        return {
          max_value: max_value || EMPTY_CHAR,
          min_value: min_value || EMPTY_CHAR,
          name_of_specification:
            `${name_of_specification?.name}, ${unit_of_measurement?.unit}` ||
            EMPTY_CHAR,
          id: specId || EMPTY_CHAR,
        };
      }),
    };
  }, [
    offerData,
    warehouseOptions,
    productSpecifications,
    actualProductId,
    productOptions,
  ]);

  const handleSubmit = (values: any) => {
    setOfferFormData({
      ...values,
      volume: Number(values?.volume),
      cost: Number(values?.cost),
      product: { id: values?.product?.value },
      warehouse: { id: values?.warehouse?.value },
      id: paramId ? Number(paramId) : undefined,
      specifications: undefined,
    });
    setSpecificationsFormData(
      values?.specifications?.map(({ max_value, id: specId }: any) => {
        return {
          id: specId,
          max_value,
        };
      })
    );
  };

  useEffect(() => {
    isEdit ? refetchOfferEdit() : refetchOfferCreate();
  }, [offerFormData]);

  useEffect(() => {
    specificationsFormData && refetchProductEdit();
  }, [specificationsFormData]);

  useEffect(() => {
    const isFormSuccess =
      (isProductEditSuccess || isCreateSuccess) && isOfferEditSuccess;
    const hasFormData = offerFormData && specificationsFormData;
    (hasFormData && isFormSuccess) ||
      (isOfferDeleteSuccess &&
        history.push(generatePath(routes.offers.list.path)));
  }, [
    isOfferEditSuccess,
    isCreateSuccess,
    isProductEditSuccess,
    specificationsFormData,
    offerFormData,
    isOfferDeleteSuccess,
  ]);

  useEffect(() => {
    const specs = getProductSpecsById(actualProductId);
    specs && setProductSpecifications(specs);
  }, [actualProductId, productsData]);

  return (
    <Flex column>
      <FormWrapper>
        <Flex column>
          <Typography size="lg2" bold>
            {`${isEdit ? "Редактировать" : "Создать"} предложение`}
          </Typography>
          <Spacer space={28} />

          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ values }: any) => {
              return (
                <Form>
                  <Flex>
                    <MainFormWrapper>
                      <FormikField name="product" title="Культура">
                        <Select
                          variant="light"
                          options={productOptions}
                          onChange={handleProductChange}
                        />
                      </FormikField>
                      <FormikField
                        name="cost"
                        title="Цена CNCPT на воротах порта, ₽/т"
                      >
                        <Input name="" variant="light" type="number" />
                      </FormikField>
                      <FormikField name="volume" title="Объем, т">
                        <Input name="volume" variant="light" type="number" />
                      </FormikField>
                      <FormikField
                        name="period_shipment"
                        title="Период поставки"
                      >
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
                        <Select options={warehouseOptions} variant="light" />
                      </FormikField>
                    </MainFormWrapper>
                    <Spacer width={250} />
                    <Indicators>
                      <FieldArray
                        name="specifications"
                        render={() => (
                          <>
                            {values?.specifications?.map(
                              (_specification: IProductSpecs, idx: number) => {
                                return (
                                  <Fragment key={idx}>
                                    <Flex>
                                      <Flex column>
                                        {idx === 0 && (
                                          <Typography color="#918F88">
                                            Показатели зерна
                                          </Typography>
                                        )}
                                        <Spacer space={10} />
                                        <Input
                                          disabled
                                          name={`specifications[${idx}].name_of_specification`}
                                          variant="light"
                                          size="md"
                                        />
                                      </Flex>
                                      <Spacer width={15} />
                                      <Flex column>
                                        {idx === 0 && (
                                          <Typography color="#918F88">
                                            Min
                                          </Typography>
                                        )}
                                        <Spacer space={10} />
                                        <Input
                                          disabled
                                          name={`specifications[${idx}].min_value`}
                                          size="sm"
                                        />
                                      </Flex>
                                      <Spacer width={15} />
                                      <Flex column>
                                        {idx === 0 && (
                                          <Typography color="#918F88">
                                            Max
                                          </Typography>
                                        )}
                                        <Spacer space={10} />
                                        <Input
                                          name={`specifications[${idx}].max_value`}
                                          variant="light"
                                          size="sm"
                                        />
                                      </Flex>
                                    </Flex>
                                  </Fragment>
                                );
                              }
                            )}
                          </>
                        )}
                      />
                    </Indicators>
                  </Flex>
                </Form>
              );
            }}
          </Formik>
        </Flex>
      </FormWrapper>
      <ActionsWrapper>
        <Flex column>
          <Typography bold size="lg">
            {isEdit ? "Сохранить изменения?" : "Опубликовать предложение?"}
          </Typography>
          <Spacer />
          <Flex>
            <Button variant="base" type="submit" size="lg">
              {isEdit ? "Сохранить" : "Опубликовать"}
            </Button>
            <Spacer width={16} />
            <Button variant="baseRed" size="lg" onClick={handleCancel}>
              Отменить
            </Button>
            <Spacer width={16} />
            {isEdit && (
              <Button variant="link" onClick={handleDelete}>
                Удалить
              </Button>
            )}
            <Spacer />
          </Flex>
        </Flex>
      </ActionsWrapper>
    </Flex>
  );
};

const Indicators = styled.div``;

const MainFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  padding: 44px;
`;

const ActionsWrapper = styled.div`
  position: fixed;
  bottom: 0;
  height: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 46px;
  border-top: 1px solid #918f89;
`;
