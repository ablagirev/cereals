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
import { useProducts } from "../../../hooks/useProducts";
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
import { formatDate, isDeepEmpty } from "../../../utils/utils";
import format from "date-fns/esm/format";
import { idText } from "typescript";

export const OfferPage: React.FC = () => {
  const { id: paramId }: IRouteParams = useParams();
  const history = useHistory();
  const pushContext = React.useContext(PushContext);
  const {
    data: productsData,
    isFetching: isProductsFetching,
    refetch: refetchProducts,
  } = useProducts();
  const { data: warehouseData, isFetching: isWarehousesFetching } =
    useWarehouses();
  const { data: offerData, isFetching: isOfferFetching } = useOffer(paramId);
  const [offerFormData, setOfferFormData] = useState<any>();
  const [chosenProductId, setChosenProductId] = useState<number>();
  const [productSpecifications, setProductSpecifications] =
    useState<IProductSpecs[]>();
  const { isSuccess: isOfferEditSuccess, refetch: refetchOfferEdit } =
    useOfferEdit(offerFormData);
  const { isSuccess: isOfferDeleteSuccess, refetch: refetchOfferDelete } =
    useOfferDelete(paramId);
  const [showModalState, setShowModalState] = useState(false);

  const isFetching =
    isProductsFetching || isWarehousesFetching || isOfferFetching;

  const {
    dateFinishShipment,
    dateStartShipment,
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

  const convertToNumber = (value: any) => {
    return typeof value === "string"
      ? Number(value?.split(" ").join(""))
      : value;
  };

  const handleSubmitForm = (values: any) => {
    const { volume, cost, product, warehouse, shipmentEnd, shipmentStart } =
      values || {};

    setOfferFormData({
      ...values,
      shipmentStart: format(shipmentStart, "yyyy-MM-dd"),
      shipmentEnd: format(shipmentEnd, "yyyy-MM-dd"),
      volume: convertToNumber(volume),
      cost: convertToNumber(cost),
      product: { id: product?.value },
      warehouse: { id: warehouse?.value },
      id: paramId ? Number(paramId) : undefined,
      specifications: values?.specifications
        ?.map(({ max, min, id: specId }: any) => {
          const value = {
            max: parseInt(max) || undefined,
            min: parseInt(min) || undefined,
          };
          return {
            id: specId,
            value: !isDeepEmpty(value) ? JSON.stringify(value) : undefined,
          };
        })
        ?.filter((el: any) => el.value),
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

  interface ISpecTooltip {
    max: number;
    min?: number;
  }

  const renderMinMaxTooltip = ({ max, min }: ISpecTooltip) => {
    return (
      <Flex>
        {isNumber(max) && isNumber(min) ? (
          <>
            <Typography size="sm">от</Typography>
            <Spacer width={4} />
            <Typography size="sm" color="#407ef5">
              {min}
            </Typography>
            <Spacer width={4} />
            <Typography size="sm">до</Typography>
            <Spacer width={4} />
            <Typography size="sm" color="#407ef5">
              {max}
            </Typography>
            <Spacer width={4} />
          </>
        ) : isNumber(max) ? (
          <>
            <Typography size="sm">По умолчанию не более:</Typography>
            <Spacer width={4} />
            <Typography size="sm" color="#407ef5">
              {max}
            </Typography>
          </>
        ) : (
          isNumber(min) && (
            <>
              <Typography size="sm">По умолчанию не менее:</Typography>
              <Spacer width={4} />
              <Typography size="sm" color="#407ef5">
                {min}
              </Typography>
            </>
          )
        )}
      </Flex>
    );
  };

  const truncateText = (text: string, limit: number) => {
    text = text.trim();
    if (text.length <= limit) return text;
    text = text.slice(0, limit);
    return text.trim() + "...";
  };

  useEffect(() => {
    offerFormData && (isEdit ? refetchOfferEdit() : refetchOfferCreate());
  }, [offerFormData]);

  useEffect(() => {
    const isFormSuccess = isCreateSuccess || isOfferEditSuccess;

    if ((isFormSuccess || isOfferDeleteSuccess) && refetchProducts()) {
      pushContext.setPushContext({
        text: isCreateSuccess
          ? "Предложене успешно создано"
          : isOfferEditSuccess
          ? "Предложение успешно отредактировано"
          : "Предложение успешно удалено",
      });
      history.push(generatePath(routes.offers.list.path));
    }
  }, [isOfferEditSuccess, isCreateSuccess, isOfferDeleteSuccess]);

  useEffect(() => {
    const specs = getProductSpecsById(actualProductId);
    specs && setProductSpecifications(specs);
  }, [actualProductId, productsData]);

  const offerSchema = Yup.object().shape({
    cost: Yup.number().min(1).required("Поле обязательное"),
    volume: Yup.number().min(1).required("Поле обязательное"),
  });

  const initialValues = useMemo(() => {
    return {
      volume,
      cost,
      product: getProduct(actualProductId),
      warehouse:
        warehouseOptions?.find(
          (option) => option?.value === offerWarehouseId
        ) || warehouseOptions?.[0],
      specifications: productSpecifications?.map((spec) => {
        const {
          unitOfMeasurement,
          id: specId,
          GOST,
          description,
          name: nameOfSpecification,
          spec: specification,
        } = spec;

        const { max, min, isEditableMax, isEditableMin } =
          (specification && JSON.parse(specification)) || {};

        return {
          max: max || BLANK_CHAR,
          min: min || BLANK_CHAR,
          GOST,
          description,
          isEditableMax,
          isEditableMin,
          nameOfSpecification: unitOfMeasurement?.unit
            ? `${nameOfSpecification}, ${unitOfMeasurement?.unit}`
            : nameOfSpecification || EMPTY_CHAR,
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
    dateStartShipment,
  ]);

  return isFetching ? (
    <Loader />
  ) : (
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
        onSubmit={handleSubmitForm}
        validationSchema={offerSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, errors }: any) => {
          const { cost: costError, volume: volumeError } = errors;
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
                        name="cost"
                        variant="light"
                        type="masked"
                        disabled={isArchived}
                        isError={!!costError}
                      />
                    </FormikField>
                    <FormikField name="volume" title="Объем, т">
                      <Input
                        name="volume"
                        variant="light"
                        type="masked"
                        disabled={isArchived}
                        isError={!!volumeError}
                      />
                    </FormikField>
                    <FormikField name="periodShipment" title="Период поставки">
                      <DatePickerField
                        initialValues={{
                          start: dateStartShipment,
                          end: dateFinishShipment,
                        }}
                        startFieldName="shipmentStart"
                        endFieldName="shipmentEnd"
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

                  <IndicatorsWrapper>
                    <Indicators>
                      <FieldArray
                        name="specifications"
                        render={() => (
                          <>
                            {initialValues?.specifications?.map(
                              (specification: any, idx: number) => {
                                const {
                                  GOST,
                                  max,
                                  min,
                                  isEditableMax,
                                  isEditableMin,
                                  description,
                                } = specification || {};

                                const isSpecValuesEditable =
                                  isEditableMax || isEditableMin;

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
                                          name={`specifications[${idx}].nameOfSpecification`}
                                          variant="blank"
                                          size="lg"
                                          tooltipContent={GOST && `${GOST}`}
                                          tooltipPlacement="left-start"
                                        />
                                      </Flex>
                                      <Spacer width={15} />
                                      {isSpecValuesEditable ? (
                                        <>
                                          <Flex column>
                                            {idx === 0 && (
                                              <Typography color="#918F88">
                                                min
                                              </Typography>
                                            )}
                                            <Spacer space={10} />
                                            <Input
                                              variant={
                                                isArchived ||
                                                !isEditableMin ||
                                                !isNumber(min)
                                                  ? "blank"
                                                  : "light"
                                              }
                                              disabled={
                                                isArchived ||
                                                !isEditableMin ||
                                                !isNumber(min)
                                              }
                                              name={`specifications[${idx}].min`}
                                              size="sm"
                                              tooltipContent={
                                                !isArchived &&
                                                isEditableMin &&
                                                isNumber(min) &&
                                                renderMinMaxTooltip({
                                                  max,
                                                  min,
                                                })
                                              }
                                            />
                                          </Flex>
                                          <Spacer width={15} />
                                          <Flex column>
                                            {idx === 0 && (
                                              <Typography color="#918F88">
                                                max
                                              </Typography>
                                            )}

                                            <Spacer space={10} />

                                            <Input
                                              name={`specifications[${idx}].max`}
                                              variant={
                                                isArchived ||
                                                !isEditableMax ||
                                                !isNumber(max)
                                                  ? "blank"
                                                  : "light"
                                              }
                                              size="sm"
                                              disabled={
                                                isArchived ||
                                                !isEditableMax ||
                                                !isNumber(max)
                                              }
                                              tooltipContent={
                                                !isArchived &&
                                                isEditableMax &&
                                                isNumber(max) &&
                                                renderMinMaxTooltip({
                                                  max,
                                                  min,
                                                })
                                              }
                                            />
                                          </Flex>
                                        </>
                                      ) : !!description ? (
                                        <Tooltip
                                          tooltipContent={description}
                                          id={`${GOST}-${description}-${max}-${min}`}
                                        >
                                          <Flex
                                            vAlignContent="center"
                                            hAlignContent="center"
                                          >
                                            <TruncatedText size="sm">
                                              {truncateText(description, 14)}
                                            </TruncatedText>
                                          </Flex>
                                        </Tooltip>
                                      ) : null}
                                    </Flex>
                                  </Fragment>
                                );
                              }
                            )}
                          </>
                        )}
                      />
                      <Spacer />
                    </Indicators>
                  </IndicatorsWrapper>
                </FormInnerWrapper>
                <Spacer space={150} />
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
                          type="submit"
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

const TruncatedText = styled(Typography)`
  overflow: hidden;
  max-width: 120px;
`;

const Indicators = styled.div`
  margin-bottom: 160px;
`;

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
  background-color: #efebde;
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
  padding: 44px;
  justify-content: space-between;
`;

const Heading = styled(Typography)`
  padding: 44px 0 0 44px;
`;

const IndicatorsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;
