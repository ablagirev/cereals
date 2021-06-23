import { Form, Formik } from "formik";
import React from "react";
import styled from "styled-components";
import { Button, Flex, Input, Spacer, Typography } from "../../../uikit";
import { FormikField } from "../../../uikit/Field";
import { Select } from "../../../uikit/Selects";
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
  const handleSubmit = (values: unknown) => console.log(values);
  return (
    <Flex column>
      <Typography size="lg2" bold>
        Создать предложение
      </Typography>
      <Spacer space={28} />

      <Formik initialValues={{ price: "asd" }} onSubmit={handleSubmit}>
        <Form>
          <StyledFlex>
            <Flex column>
              <FormikField name="someOptions" title="Культура">
                <Select variant="light" options={fakeOptions} />
              </FormikField>
              <FormikField name="price" title="Цена">
                <Input name="price" disabled />
              </FormikField>
              <DatePickerField />
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
