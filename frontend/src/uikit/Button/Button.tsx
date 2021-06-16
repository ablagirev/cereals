import React, { forwardRef, ReactNode } from "react";
import BSButton from "react-bootstrap/Button";
import {
  BsPrefixPropsWithChildren,
  BsPrefixRefForwardingComponent,
} from "react-bootstrap/esm/helpers";
import { ButtonVariant } from "react-bootstrap/esm/types";

export declare type ButtonType = "button" | "reset" | "submit" | string;

/**
 * Свойства компонента.
 *
 * @prop {boolean} active Активность.
 */
export interface IButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    Omit<BsPrefixPropsWithChildren, "children"> {
  active?: boolean;
  block?: boolean;
  variant?: ButtonVariant;
  size?: "sm" | "lg";
  type?: ButtonType;
  href?: string;
  disabled?: boolean;
  target?: any;
  children?: ReactNode;
}
declare type Button = BsPrefixRefForwardingComponent<"button", IButtonProps>;
export declare type CommonButtonProps =
  | "href"
  | "size"
  | "variant"
  | "disabled";

export const Button: Button = forwardRef((props, ref) => (
  <BSButton {...props} ref={ref} />
));
