import styled from "styled-components";
import { Flex, Spacer, Typography } from "..";

export interface ITableRow {
  title: string;
  content: string[];
}

export const TableRow: React.FC<ITableRow> = ({ title, content }) => {
  return (
    <Flex>
      <StyledTypography color={"#918F89"} size="md">
        {title}
      </StyledTypography>
      {content?.length && (
        <ul>
          {content.map((item: string, idx) => (
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
