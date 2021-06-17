import React, { ReactNode } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { theme } from "../../theme";

export declare type ButtonType = "action" | "link" | "base";

export interface IButtonProps {
  onClick?: () => void;
  size?: "sm" | "lg";
  type?: "submit" | "button" | "reset";
  variant: ButtonType;
  disabled?: boolean;
  children?: ReactNode;
}

// const getBgColor = (type: )

const preset = {
  base: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#407EF5",
    borderColor: "#407EF5",
    shadow: "none",
  },
  link: {
    backgroundColor: "transparent",
    color: "#407EF5",
    borderColor: "transparent",
    shadow: "none",
  },
  action: {
    backgroundColor: theme.palette.common.colors.purple,
    color: "#ffffff",
    borderColor: "transparent",
    shadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
  },
};

export const Button: React.FC<IButtonProps> = ({
  children,
  onClick,
  variant,
  disabled,
  ...rest
}) => (
  <StyledButton
    onClick={onClick}
    variant={variant}
    disabled={disabled}
    {...rest}
  >
    {children}
  </StyledButton>
);

const StyledButton = styled.button<IButtonProps>`
  width: 345px;
  height: 50px;
  cursor: pointer;
  background-color: ${({ variant }) => preset[variant].backgroundColor};
  border: 1px solid ${({ variant }) => preset[variant].borderColor};
  box-shadow: ${({ variant }) => preset[variant].shadow};
  border-radius: 10px;
  color: ${({ variant }) => preset[variant].color};
  transition: 0.3s;

  &:hover {
    background-color: ${({ variant }) =>
      darken(0.05, preset[variant].backgroundColor)};
  }
  &:active {
    background-color: ${({ variant }) =>
      darken(0.08, preset[variant].backgroundColor)};
  }
`;
