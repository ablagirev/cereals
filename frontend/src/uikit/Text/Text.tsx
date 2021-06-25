/* eslint-disable react/require-default-props */
import React from "react";
import styled from "styled-components";

interface IProps {
  caption?: boolean;
  inverted?: boolean;
  reset?: boolean;
  size?: string;
  sizemob?: string;
  align?: "center" | "right" | "justify";
  className?: string;
  children: React.ReactElement | React.ReactNode;
}

interface IWrapperProps {
  size: string;
  caption?: boolean;
  inverted?: boolean;
  reset?: boolean;
  sizemob?: string;
  className?: string;
  align?: "center" | "right" | "justify";
}

const calculateFS = (size: string) => {
  return size === "xl"
    ? 32
    : size === "lg2"
    ? 22
    : size === "lg"
    ? 17
    : size === "md"
    ? 15
    : size === "sm"
    ? 13
    : size === "xs"
    ? 12
    : 10;
};

const calculateLH = (size: string, caption?: boolean) => {
  return size === "xl"
    ? 42
    : size === "lg2"
    ? 26
    : size === "lg"
    ? 24
    : size === "md"
    ? 20
    : size === "sm" || (size === "sm" && caption)
    ? 15
    : 14;
};

export const Text = ({
  caption = false,
  children,
  inverted = false,
  reset = false,
  size = "md",
  sizemob = "md",
  ...rest
}: IProps) => {
  return (
    <Wrapper
      caption={caption}
      size={size}
      sizemob={sizemob}
      reset={reset}
      inverted={inverted}
      {...rest}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.span<IWrapperProps>`
  font-size: ${({ size }) => calculateFS(size)}px;
  line-height: ${({ caption, reset, size }) =>
    reset ? "1em" : `${calculateLH(size, caption)}px`};
  margin-top: 0;
  margin-bottom: 0;
  font-family: "Rubik", "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-align: ${({ align }) => align ?? "left"};
`;
