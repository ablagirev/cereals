import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex } from "..";
import styled from "styled-components";
import ru from "date-fns/locale/ru";

registerLocale("ru", ru);

interface IProps {
  initialValues: {
    start?: string;
    end?: string;
  };
  startFieldName: string;
  endFieldName: string;
  hasCounter?: boolean;
  disabled?: boolean;
}

export const DatePickerField: React.FC<IProps> = ({
  initialValues,
  startFieldName,
  endFieldName,
  hasCounter = false,
  disabled,
}) => {
  const { start, end } = initialValues;
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { setFieldValue, values } = useFormikContext();
  const [days, setDays] = useState<number>();

  useEffect(() => {
    startDate && setFieldValue(startFieldName, startDate);
    endDate && setFieldValue(endFieldName, endDate);
    setDays(
      Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  }, [startDate, endDate, startFieldName, endFieldName, values]);

  useEffect(() => {
    (start || end) && setStartDate(new Date(start || end || ""));
    (end || start) && setEndDate(new Date(end || start || ""));
  }, [start, end]);

  return (
    <Flex>
      <DatePickerWrapper fillWidth>
        <StyledDatePicker
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          dateFormat="dd.MM.yyyy"
          disabled={disabled}
          locale="ru"
          maxDate={endDate}
          selectsStart
        />
        <StyledDatePicker
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          startDate={startDate}
          minDate={startDate}
          dateFormat="dd.MM.yyyy"
          disabled={disabled}
          locale="ru"
          selectsEnd
        />
      </DatePickerWrapper>
      {hasCounter && <DaysCounter>{`${days} д.`}</DaysCounter>}
    </Flex>
  );
};

const DatePickerWrapper = styled(Flex)`
  min-width: 345px !important;
  justify-content: space-between;

  .react-datepicker {
    border: 1px solid #e7e7e7;
  }

  .react-datepicker__month-container,
  .react-datepicker__header {
    background-color: #f2efe5;
  }

  .react-datepicker__header {
    border-bottom: 1px solid #e7e7e7;
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-range,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: #407ef5;
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover,
  .react-datepicker__day--selected:hover,
  .react-datepicker__day--in-range:hover,
  .react-datepicker__day--in-selecting-range:hover,
  .react-datepicker__month-text--selected:hover,
  .react-datepicker__month-text--in-selecting-range:hover,
  .react-datepicker__month-text--in-range:hover,
  .react-datepicker__month-text--in-selecting-range:hover,
  .react-datepicker__month-text--in-range:hover,
  .react-datepicker__quarter-text--selected:hover,
  .react-datepicker__quarter-text--in-selecting-range:hover,
  .react-datepicker__quarter-text--in-range:hover,
  .react-datepicker__year-text--selected:hover,
  .react-datepicker__year-text--in-selecting-range:hover,
  .react-datepicker__year-text--in-range:hover {
    background-color: #918f89;
  }
`;

const DaysCounter = styled.div`
  display: flex;
  margin-left: 28px;
  height: 50px;
  min-width: 55px;
  align-items: center;
`;

const StyledDatePicker = styled(DatePicker)`
  height: 50px;
  border: 0px;
  border: 1px solid none;
  background-color: #f5f2ea;
  border-radius: 6px;
  color: #333333;
  text-align: center;
`;
