import React from "react";
import styled from "styled-components";
import { Flex } from "..";
import { theme } from "../../theme";
import { Typography } from "../Text";

interface IProps {
  step: number;
  title: string;
}

export const Step: React.FC<IProps> = ({ step, title, children }) => {
  return (
    <Flex>
      <StyledTypography
        color={theme.palette.common.colors.darkGray}
      >{`${step}.`}</StyledTypography>
      <Flex column>
        <Typography bold>{title}</Typography>
        <>{children}</>
      </Flex>
    </Flex>
  );
};

const StyledTypography = styled(Typography)`
  margin-right: 60px;
`;
