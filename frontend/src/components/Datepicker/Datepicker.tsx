import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex } from "../../uikit";
import styled from "styled-components";

interface IProps {
  initialValues: {
    start?: string;
    end?: string;
  };
  startFieldName: string;
  endFieldName: string;
  hasCounter?: boolean;
}

export const DatePickerField: React.FC<IProps> = ({
  initialValues,
  startFieldName,
  endFieldName,
  hasCounter = false,
}) => {
  const { start, end } = initialValues;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { setFieldValue } = useFormikContext();
  const [days, setDays] = useState<number>();

  useEffect(() => {
    setFieldValue(startFieldName, startDate);
    setFieldValue(endFieldName, endDate);
    setDays(
      Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
  }, [startDate, endDate]);

  useEffect(() => {
    start && setStartDate(new Date(start));
    end && setEndDate(new Date(end));
  }, [start, end]);

  console.log();

  return (
    <Flex>
      <StyledFlex fillWidth>
        <StyledDatePicker
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <StyledDatePicker
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </StyledFlex>
      {hasCounter && (
        <DaysCounter
          fillWidth
          vAlignContent="center"
        >{`${days} дней`}</DaysCounter>
      )}
    </Flex>
  );
};

const StyledFlex = styled(Flex)`
  min-width: 345px !important;
  justify-content: space-between;
`;

const DaysCounter = styled(Flex)`
  margin-left: 28px;
  height: 50px;
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
