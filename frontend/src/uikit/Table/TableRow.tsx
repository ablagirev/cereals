import { ReactNode } from "react";
import styled from "styled-components";
import { Flex, Spacer, Typography } from "..";

type TContentItem = ReactNode | string | number | JSX.Element;
export interface ITableRow {
  title: string;
  content: TContentItem[];
}

export const TableRow: React.FC<ITableRow> = ({ title, content }) => {
  return (
    <Flex>
      <StyledTypography color={"#918F89"} size="md">
        {title}
      </StyledTypography>
      {content?.length && (
        <ul>
          {content.map((item: TContentItem, idx) => (
            <li key={idx}>
              <Typography>{item}</Typography>
              <Spacer space={10} />
            </li>
          ))}
        </ul>
      )}
    </Flex>
  );
};

const StyledTypography = styled(Typography)`
  min-width: 200px;
`;
