import React, { ReactNode } from "react";
import styled from "styled-components";
import { darken } from "polished";

export declare type ButtonType = "submit" | "link" | "base";

export interface IButtonProps {
  onClick?: () => void;
  size?: "sm" | "lg";
  type?: ButtonType;
  disabled?: boolean;
  children?: ReactNode;
}
export const Button: React.FC<IButtonProps> = ({ children, onClick }) => (
  <StyledButton onClick={onClick}>{children}</StyledButton>
);

const StyledButton = styled.button`
  width: 345px;
  height: 50px;
  cursor: pointer;
  background: #8e66fe;
  border: 0;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  color: #ffffff;
  transition: 0.3s;

  &:hover {
    background-color: ${() => darken(0.04, "#8e66fe")};
  }
  &:active {
    background-color: ${() => darken(0.07, "#8e66fe")};
  }
`;
