import React from "react";
import { Field } from "formik";
import { EMPTY_CHAR } from "../../utils/consts";
import styled from "styled-components";
import { Flex, Spacer, Typography } from "..";
import { theme } from "../../theme";
import isNil from "lodash-es/isNil";

import { IMaskInput } from "react-imask";
import { Tooltip } from "../Tooltip";

const configBlocks = {
  blocks: {
    numberInput: {
      mask: Number,
      radix: ".", // fractional delimiter
      scale: 2, // digits after point, 0 for integers
      signed: true, // disallow negative
      thousandsSeparator: " ", // any single char
      padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
      normalizeZeros: true, // appends or removes zeros at ends
      value: "",
      unmask: true, // true|false|'typed'
    },
  },
  mask: "numberInput",
};

export interface IInputProps {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  isError?: boolean;
  value?: any;
  onChange?: any;
  variant?: "light" | "dark" | "blank";
  size?: "lg" | "md" | "sm";
  tooltipContent?: string | number | JSX.Element | null | false;
  errorText?: string;
  tooltipPlacement?:
    | "auto-start"
    | "auto"
    | "auto-end"
    | "top-start"
    | "top"
    | "top-end"
    | "right-start"
    | "right"
    | "right-end"
    | "bottom-end"
    | "bottom"
    | "bottom-start"
    | "left-end"
    | "left"
    | "left-start";
}

const getBgColor = (variant: Pick<IInputProps, "variant">) => {
  switch (variant) {
    case "light":
      return "#F5F2EA";
    case "dark":
      return "#e7e2d4";
    default:
      return "#EFEBDE";
  }
};

const getWidth = (size: Pick<IInputProps, "size">) => {
  switch (size) {
    case "sm":
      return 55;
    case "md":
      return 192;
    default:
      return 345;
  }
};

export const Input: React.FC<IInputProps> = ({
  name,
  placeholder = EMPTY_CHAR,
  label,
  type,
  disabled,
  isError,
  variant,
  size,
  tooltipContent,
  tooltipPlacement = "auto",
  value,
  onChange,
  errorText,
  ...restProps
}) => {
  const renderInput = () => (
    <FieldWrapper
      isError={isError}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      {type === "masked" ? (
        <StyledIMaskInput
          {...configBlocks}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          variant={variant}
          size={size}
          value={!isNil(value) ? String(value) : null}
          onAccept={onChange}
          mask="numberInput" // enable number mask
          autoComplete="off"
          {...restProps}
        />
      ) : (
        <StyledField
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          variant={variant}
          size={size}
          autoComplete="off"
        />
      )}
    </FieldWrapper>
  );

  return (
    <>
      {label && (
        <>
          <label htmlFor={name}>{label}</label>
          <Spacer space={4} />
        </>
      )}
      {!!errorText && (
        <Flex column vAlignContent="center" hAlignContent="center">
          <Typography color={theme.palette.common.colors.red}>
            {errorText}
          </Typography>
          <Spacer space={32} />
        </Flex>
      )}
      <Tooltip
        tooltipContent={tooltipContent}
        tooltipPlacement={tooltipPlacement}
        id={name}
      >
        {renderInput()}
      </Tooltip>
    </>
  );
};

const FieldWrapper = styled.div<any>`
  text-align: ${({ size }) => size === "sm" && "center"};
  width: ${({ size }) => getWidth(size)}px;
  height: 50px;
  border: 0px;
  border: 1px solid
    ${({ isError }) => (isError ? theme.palette.common.colors.red : "#E7E2D1")};
  background-color: ${({ variant }) => getBgColor(variant)};
  border-radius: 6px;
  overflow: hidden;

  &:hover {
    border-color: ${({ disabled }) => !disabled && "#407ef5"};
  }
`;

const StyledField = styled<any>(Field)`
  text-align: ${({ size }) => size === "sm" && "center"};
  padding-left: ${({ size }) => size !== "sm" && 20}px;
  width: ${({ size }) => getWidth(size) - 20}px;
  height: 50px;
  border: 0px;
  outline: none;
  background-color: ${({ variant }) => getBgColor(variant)};
  color: #333333;
  -webkit-box-shadow: 0 0 0 30px ${({ variant }) => getBgColor(variant)} inset !important;
`;

const StyledIMaskInput = styled<any>(IMaskInput)`
  text-align: ${({ size }) => size === "sm" && "center"};
  padding-left: ${({ size }) => size !== "sm" && 20}px;
  width: ${({ size }) => getWidth(size) - 20}px;
  height: 50px;
  border: 0px;
  outline: none;
  background-color: ${({ variant }) => getBgColor(variant)};
  color: #333333;
  -webkit-box-shadow: 0 0 0 30px ${({ variant }) => getBgColor(variant)} inset !important;
`;
