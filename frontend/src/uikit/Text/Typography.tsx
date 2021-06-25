import React from "react";
import { theme } from "../../theme";

import { Bold } from "./Bold";
import { Color } from "./Color";
import { Text } from "./Text";

interface IProps {
  color?: string;
  bold?: boolean;
  caption?: boolean;
  inverted?: boolean;
  reset?: boolean;
  size?: string;
  sizemob?: string;
  align?: "center" | "right" | "justify";
  className?: string;
  children: React.ReactElement | React.ReactNode;
}

export const Typography = ({
  bold = false,
  children,
  color,
  inverted,
  ...rest
}: IProps) => {
  return (
    <Text {...rest}>
      <Color
        color={`${
          inverted
            ? theme.palette.common.colors.white
            : color || theme.palette.text.primary
        }`}
      >
        <Bold bold={bold}>{children}</Bold>
      </Color>
    </Text>
  );
};
