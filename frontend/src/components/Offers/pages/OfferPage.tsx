import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  useOffer,
  useOfferCreate,
  useOfferEdit,
} from "../../../hooks/useOffers";
import { IOffer } from "../../../services/models";
import { Button, Flex, Input, Spacer, Typography } from "../../../uikit";
import { FormikField } from "../../../uikit/Field";
import { Select } from "../../../uikit/Selects";
import { IRouteParams } from "../../../utils/models";
import { DatePickerField } from "../../Datepicker/Datepicker";

const fakeOptions = [
  {
    value: "1",
    label: "1",
  },
  {
    value: "1asdas",
    label: "13333",
  },
  {
    value: "1asd423434sad",
    label: "1asdsa",
  },
];

export const OfferPage: React.FC = () => {
  const { id }: IRouteParams = useParams();
  const { data: initialOfferData } = useOffer(id);
  const [formData, setFormData] = useState();
  const { date_finish_shipment, date_start_shipment, volume } =
    initialOfferData || {};

  const { isSuccess, refetch: refetchOfferEdit } = useOfferEdit(formData);

  const handleSubmit = (values: any) => {
    // TODO: обработать данные формы в модель предложения
    setFormData({ ...values, id });
    console.log(values);
  };

  useEffect(() => {
    refetchOfferEdit();
  }, [formData]);

  return (
    <Flex column>
      <Typography size="lg2" bold>
        {`${id ? "Редактировать" : "Создать"} предложение`}
      </Typography>
      <Spacer space={28} />

      <Formik
        enableReinitialize={true}
        initialValues={{
          volume,
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <StyledFlex>
            <Flex column>
              <FormikField name="someOptions" title="Культура">
                <Select variant="light" options={fakeOptions} />
              </FormikField>
              <FormikField name="price" title="Цена">
                <Input name="price" disabled />
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
                />
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
