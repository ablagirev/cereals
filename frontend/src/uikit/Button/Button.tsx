import React, { ReactNode } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { theme } from "../../theme";

export declare type ButtonVariant =
  | "action"
  | "link"
  | "base"
  | "icon"
  | "baseRed";

export interface IButtonProps {
  onClick?: (e: any) => void;
  size?: "sm" | "lg" | "md";
  type?: "submit" | "button" | "reset";
  variant: ButtonVariant;
  disabled?: boolean;
  children?: ReactNode;
}

const getWidth = (size?: string) => {
  switch (size) {
    case "sm":
      return 55;
    case "md":
      return 192;
    default:
      return 345;
  }
};

const preset = {
  base: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#407EF5",
    borderColor: "#407EF5",
    shadow: "none",
  },
  baseRed: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: theme.palette.common.colors.red,
    borderColor: theme.palette.common.colors.red,
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
  icon: {
    backgroundColor: "transparent",
    color: "initial",
    borderColor: "transparent",
    shadow: "none",
  },
};

export const Button: React.FC<IButtonProps> = ({
  children,
  onClick,
  variant,
  disabled,
  size,
  ...rest
}) => (
  <StyledButton
    onClick={onClick}
    variant={variant}
    disabled={disabled}
    size={size}
    {...rest}
  >
    {children}
  </StyledButton>
);

const StyledButton = styled.button<IButtonProps>`
  width: ${({ size }) => getWidth(size)}px;
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
