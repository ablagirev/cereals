import { darken } from "polished";
import React from "react";
import ReactSelect from "react-select";
import styled from "styled-components";

interface ISelect {
  value: string;
  label: string;
}

interface IProps {
  options: ISelect[];
}

export const Select: React.FC<IProps> = ({ options, ...rest }) => (
  <StyledReactSelect classNamePrefix="Select" options={options} {...rest} />
);

const StyledReactSelect = styled(ReactSelect)`
  color: #333333;
  transition: 0.3s;

  .Select__control {
    cursor: pointer;
    min-width: 345px;
    height: 50px;
    border: 0px;
    background-color: #e7e2d4;
    border-radius: 6px;
  }

  .Select__indicator-separator {
    display: none;
  }

  .Select__menu {
    background-color: #e7e2d4;
  }

  .Select__option {
    color: #333333;
    background-color: #e7e2d4;
    cursor: pointer;

    &:hover {
      background-color: ${() => darken(0.03, "#e7e2d4")};
    }
  }
`;
