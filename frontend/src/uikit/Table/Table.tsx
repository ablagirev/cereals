import { FC } from "react";
import styled from "styled-components";
import { Flex, Spacer, Typography } from "..";
import { ITableRow, TableRow } from "./TableRow";

interface ITableHeaderItem {
  title: string;
  value: string | JSX.Element | number | null | undefined;
}
interface IProps {
  headerData?: ITableHeaderItem[];
  data: ITableRow[];
}

export const Table: FC<IProps> = ({ headerData, data }) => {
  return (
    <Flex column>
      {headerData?.length ? (
        <Header>
          {headerData?.map((item) => {
            const { title, value } = item || {};
            return (
              <Flex column>
                <Typography color={"#918F89"} size="md">
                  {title}
                </Typography>
                <Spacer space={8} />
                <Typography size="lg">{value}</Typography>
              </Flex>
            );
          })}
        </Header>
      ) : null}
      <table>
        {data.map((item, idx) => {
          const { title, content } = item || {};
          return <TableRow key={idx} title={title} content={content} />;
        })}
      </table>
    </Flex>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 44px;
`;
