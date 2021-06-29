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
  variant?: "light" | "dark" | "blank";
  size?: "lg" | "md" | "sm";
}

const getBgColor = (variant: Pick<IProps, "variant">) => {
  switch (variant) {
    case "light":
      return "#F5F2EA";
    case "dark":
      return "#e7e2d4";
    default:
      return "transparent";
  }
};

const getWidth = (size: Pick<IProps, "size">) => {
  switch (size) {
    case "sm":
      return 55;
    case "md":
      return 192;
    default:
      return 345;
  }
};

export const Input: React.FC<IProps> = ({
  name,
  placeholder = EMPTY_CHAR,
  label,
  type,
  disabled,
  isError,
  variant,
  size,
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
      variant={variant}
      size={size}
    />
  </>
);

const StyledField = styled(Field)`
  width: ${({ size }) => getWidth(size)}px;
  height: 50px;
  border: 0px;
  border: 1px solid
    ${({ isError }) => (isError ? theme.palette.common.colors.red : "none")};
  background-color: ${({ variant }) => getBgColor(variant)};
  border-radius: 6px;
  color: #333333;
`;
