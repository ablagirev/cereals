import { darken } from "polished";
import React from "react";
import ReactSelect from "react-select";
import styled from "styled-components";

interface ISelect {
  value: string | number;
  label: string | number;
}

interface IProps {
  variant?: "light" | "dark";
  options: ISelect[];
}

const getBgColor = (variant: "light" | "dark") =>
  variant === "light" ? "#F5F2EA" : "#e7e2d4";

export const Select: React.FC<IProps> = ({
  options,
  variant = "dark",
  ...rest
}) => (
  <StyledReactSelect
    classNamePrefix="Select"
    options={options}
    variant={variant}
    {...rest}
  />
);

const StyledReactSelect = styled(ReactSelect)`
  color: #333333;
  transition: 0.3s;

  .Select__value-container {
    padding-left: 20px;
  }

  .Select__control {
    cursor: pointer;
    width: 345px;
    height: 50px;
    border: 0px;
    background-color: ${({ variant }) => getBgColor(variant)};
    border-radius: 6px;
  }

  .Select__indicator-separator {
    display: none;
  }

  .Select__menu {
    background-color: ${({ variant }) => getBgColor(variant)};
  }

  .Select__option {
    color: #333333;
    background-color: ${({ variant }) => getBgColor(variant)};
    cursor: pointer;

    &:hover {
      background-color: ${({ variant }) => darken(0.03, getBgColor(variant))};
    }
  }
`;
