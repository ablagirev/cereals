import React from "react";
import { Field } from "formik";
import { EMPTY_CHAR } from "../../utils/consts";
import styled from "styled-components";
import { Spacer } from "..";
import { theme } from "../../theme";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

interface IProps {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  isError?: boolean;
  variant?: "light" | "dark" | "blank";
  size?: "lg" | "md" | "sm";
  tooltipContent?: string | number | JSX.Element;
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
  tooltipContent,
  tooltipPlacement = "auto",
}) => {
  const renderInput = () => (
    <FieldWrapper isError={isError} variant={variant} size={size}>
      <StyledField
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
      />
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
      {!!tooltipContent ? (
        <OverlayTrigger
          delay={{ hide: 450, show: 300 }}
          placement={tooltipPlacement}
          trigger="hover"
          overlay={(props) => (
            <StyledTooltip id={`${name}-${type}`} {...props}>
              {tooltipContent}
            </StyledTooltip>
          )}
        >
          {renderInput()}
        </OverlayTrigger>
      ) : (
        renderInput()
      )}
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
`;

const StyledField = styled(Field)`
  padding-left: ${({ size }) => size !== "sm" && 20}px;
  width: ${({ size }) => getWidth(size) - 20}px;
  height: 50px;
  border: 0px;
  outline: none;
  background-color: #f5f2ea;
  color: #333333;
`;

const StyledTooltip = styled(Tooltip)`
  .tooltip-inner {
    background: #f2efe5;
    box-shadow: 0px 1px 5px rgba(104, 104, 104, 0.1);
    border-radius: 6px;
    color: #333333;
    min-height: 30px;
  }

  .arrow::before,
  .bs-tooltip-bottom .arrow::before {
    display: none;
  }
`;
