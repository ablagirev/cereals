import React from "react";
import styled from "styled-components";
import { Flex } from "..";
import { EMPTY_CHAR } from "../../utils/consts";
import { Typography } from "../Text";

interface IProps {
  title: string;
  statusText?: JSX.Element;
  onClick?: () => void;
}

export const Card: React.FC<IProps> = ({
  title,
  statusText,
  children,
  onClick,
  ...rest
}) => {
  return (
    <Wrapper onClick={onClick} {...rest}>
      <StyledFlex>
        <Flex column>
          <Typography size="lg" bold>
            {title}
          </Typography>
        </Flex>
        {statusText || EMPTY_CHAR}
      </StyledFlex>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 800px;
  background-color: #f9f6ed;
  border-radius: 10px;
  cursor: pointer;
  padding: 30px 40px;
`;

const StyledFlex = styled(Flex)`
  justify-content: space-between;
`;
