import styled from "styled-components";
import { theme } from "../../theme";

interface IProps {
  bold?: boolean;
}

export const Bold = styled.b<IProps>`
  font-weight: ${({ bold }) => (bold ? theme.typography.fontWeightBold : 400)};
`;
