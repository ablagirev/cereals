import React from "react";
import { Field } from "formik";
import { EMPTY_CHAR } from "../../utils/consts";
import styled from "styled-components";
import { Spacer } from "..";
import { theme } from "../../theme";

interface IProps {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  isError?: boolean;
}

export const Input: React.FC<IProps> = ({
  name,
  placeholder = EMPTY_CHAR,
  label,
  type,
  disabled,
  isError,
}) => (
  <>
    {label && (
      <>
        <label htmlFor={name}>{label}</label>
        <Spacer space={4} />
      </>
    )}
    <StyledField
      id={name}
      name={name}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      isError={isError}
    />
  </>
);

const StyledField = styled(Field)`
  width: 345px;
  height: 50px;
  border: 0px;
  border: 1px solid
    ${({ isError }) => (isError ? theme.palette.common.colors.red : "none")};
  background-color: #e7e2d4;
  border-radius: 6px;
  color: #333333;
`;
