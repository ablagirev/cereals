import React from 'react';
import styled from 'styled-components';

const DEFAULT_SPACE = 16;
const DEFAULT_WIDTH = 0;

interface IProps {
    space?: number;
    width?: number;
}

export const Spacer = ({space = DEFAULT_SPACE, width = DEFAULT_WIDTH, ...rest}: IProps) => (
    <InnerSpacer data-test-id="spacer" space={space} width={width} {...rest} />
);

const InnerSpacer = styled.div<IProps>`
    height: ${({space}) => space}px;
    width: ${({width}) => width}px;
    &:before {
        content: '${({space}) => space}';
        display: none;
    }
`;
