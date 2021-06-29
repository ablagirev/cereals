import React from "react";
import styled from "styled-components";
import { Flex } from "..";
import { theme } from "../../theme";
import { Typography } from "../Text";

interface IProps {
  title: string;
  statusText?: string;
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
        {statusText && (
          <Typography size="sm" color="#918F89">
            {statusText}
          </Typography>
        )}
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
