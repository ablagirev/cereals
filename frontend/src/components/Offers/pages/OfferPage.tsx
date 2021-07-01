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
import Modal from "react-bootstrap/esm/Modal";
import { getTrimText } from "../../../utils/utils";

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
  const [showModalState, setShowModalState] = useState(false);

  const {
    date_finish_shipment,
    date_start_shipment,
    volume,
    cost,
    product: offerProduct,
    warehouse: offerWarehouse,
    status: offerStatus,
  } = offerData || {};

  const offerProductId = offerProduct?.id;
  const offerWarehouseId = offerWarehouse?.id;

  const { isSuccess: isCreateSuccess, refetch: refetchOfferCreate } =
    useOfferCreate(offerFormData);

  const isEdit = !!paramId;
  const isArchived = offerStatus === "archive";

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

  const handleModalOpen = () => {
    setShowModalState(true);
  };

  const handleModalClose = () => {
    setShowModalState(false);
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

  const { isSuccess: isProductEditSuccess, refetch: refetchProductEdit } =
    useProductEdit({
      id: actualProductId,
      specifications: specificationsFormData,
    });

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
            getTrimText(
              `${name_of_specification?.name}, ${unit_of_measurement?.unit}`
            ) || EMPTY_CHAR,
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

  const onSubmit = (values: any) => {
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
          <Typography bold size="lg">
            Удалить предложение?
          </Typography>
          <Spacer space={15} />
          <Typography>Вы не сможете восстановить его обратно</Typography>
          <Spacer space={25} />
          <Button variant="baseRed" size="lg" onClick={handleDelete}>
            Да, удалить
          </Button>
          <Button variant="link" size="lg" onClick={handleModalClose}>
            Нет, отменить
          </Button>
        </Flex>
      </ModalContent>
    </StyledModal>
  );

  useEffect(() => {
    isEdit ? refetchOfferEdit() : refetchOfferCreate();
  }, [offerFormData]);

  useEffect(() => {
    specificationsFormData && refetchProductEdit();
  }, [specificationsFormData]);

  useEffect(() => {
    const isFormSuccess =
      isProductEditSuccess && (isCreateSuccess || isOfferEditSuccess);
    (isFormSuccess || isOfferDeleteSuccess) &&
      history.push(generatePath(routes.offers.list.path));
  }, [
    isOfferEditSuccess,
    isCreateSuccess,
    isProductEditSuccess,
    isOfferDeleteSuccess,
  ]);

  useEffect(() => {
    const specs = getProductSpecsById(actualProductId);
    specs && setProductSpecifications(specs);
  }, [actualProductId, productsData]);

  return (
    <Flex column>
      <Heading size="lg2" bold>
        {`${
          isArchived ? "Завершенное" : isEdit ? "Редактировать" : "Создать"
        } предложение`}
      </Heading>
      <Spacer space={28} />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ values, handleSubmit }: any) => {
          return (
            <>
              <Form>
                <FormInnerWrapper>
                  <MainFormWrapper>
                    <FormikField name="product" title="Культура">
                      <Select
                        variant="light"
                        options={productOptions}
                        onChange={handleProductChange}
                        disabled={isArchived}
                      />
                    </FormikField>
                    <FormikField
                      name="cost"
                      title="Цена CNCPT на воротах порта, ₽/т"
                    >
                      <Input
                        name=""
                        variant="light"
                        type="number"
                        disabled={isArchived}
                      />
                    </FormikField>
                    <FormikField name="volume" title="Объем, т">
                      <Input
                        name="volume"
                        variant="light"
                        type="number"
                        disabled={isArchived}
                      />
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
                        disabled={isArchived}
                      />
                    </FormikField>
                    <FormikField name="warehouse" title="Порт">
                      <Select
                        options={warehouseOptions}
                        variant="light"
                        disabled={isArchived}
                      />
                    </FormikField>
                  </MainFormWrapper>
                  <Spacer width={250} />
                  <Indicators>
                    <FieldArray
                      name="specifications"
                      render={() => (
                        <>
                          {values?.specifications?.map(
                            (specification: IProductSpecs, idx: number) => {
                              const { GOST } = specification || {};
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
                                        variant="blank"
                                        size="lg"
                                        tooltipContent={GOST}
                                        tooltipPlacement="left-start"
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
                                        disabled={isArchived}
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
                </FormInnerWrapper>
              </Form>
              <ActionsWrapper>
                <Flex column>
                  {!isArchived && (
                    <>
                      <Typography bold size="lg">
                        {isEdit
                          ? "Сохранить изменения?"
                          : "Опубликовать предложение?"}
                      </Typography>
                      <Spacer />
                    </>
                  )}
                  <Flex>
                    {!isArchived && (
                      <>
                        <Button
                          variant="base"
                          size="lg"
                          onClick={handleSubmit as () => void}
                        >
                          {isEdit ? "Сохранить" : "Опубликовать"}
                        </Button>
                        <Spacer width={16} />
                      </>
                    )}
                    {!isArchived && (
                      <>
                        <Button
                          variant="baseRed"
                          size="lg"
                          onClick={handleCancel as () => void}
                        >
                          Отменить
                        </Button>
                        <Spacer width={16} />
                      </>
                    )}
                    {isArchived && (
                      <>
                        <Button
                          variant="base"
                          size="lg"
                          onClick={handleCancel as () => void}
                        >
                          Назад
                        </Button>
                        <Spacer width={16} />
                      </>
                    )}
                    {isEdit && !isArchived && (
                      <Button
                        variant="link"
                        onClick={handleModalOpen as () => void}
                      >
                        Удалить
                      </Button>
                    )}
                    <Spacer />
                  </Flex>
                </Flex>
              </ActionsWrapper>
            </>
          );
        }}
      </Formik>
      {renderModal()}
    </Flex>
  );
};

const Indicators = styled.div``;

const MainFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const FormInnerWrapper = styled(Flex)`
  padding: 0 44px;
`;

const Heading = styled(Typography)`
  padding: 44px 0 0 44px;
`;
