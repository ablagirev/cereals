import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex } from "../../uikit";

export const DatePickerField: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date("2014/02/08"));
  const [endDate, setEndDate] = useState(new Date("2014/02/10"));
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue("startDate", startDate.toString());
    setFieldValue("endDate", endDate.toString());
  }, [startDate, endDate]);

  return (
    <Flex>
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        selected={endDate}
        onChange={(date: Date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
    </Flex>
  );
};
