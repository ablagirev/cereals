import { ReactNode } from "react";
import styled from "styled-components";
import { Flex, Spacer, Typography } from "..";

type TContentItem = ReactNode | string | number | JSX.Element;
export interface ITableRow {
  title: string | JSX.Element;
  content: TContentItem[];
}

export const TableRow: React.FC<ITableRow> = ({ title, content }) => {
  return (
    <StyledTr>
      <StyledTd>
        <StyledTypography color={"#918F89"} size="md">
          {title}
        </StyledTypography>
      </StyledTd>
      <StyledTd>
        {!!content?.length && (
          <Flex>
            <Spacer width={60} />
            <ul>
              {content.map((item: TContentItem, idx) => (
                <li key={idx}>
                  <Typography>{item}</Typography>
                  <Spacer space={10} />
                </li>
              ))}
            </ul>
          </Flex>
        )}
      </StyledTd>
    </StyledTr>
  );
};

const StyledTypography = styled(Typography)`
  min-width: 200px;
  max-width: 300px;
`;

const StyledTr = styled.tr``;

const StyledTd = styled.td`
  vertical-align: top;
  padding: 4px;
`;
