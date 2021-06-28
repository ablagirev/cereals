import { FC, Fragment } from "react";
import { Spacer } from "..";
import { ITableRow, TableRow } from "./TableRow";

interface IProps {
  data: ITableRow[];
}

export const Table: FC<IProps> = ({ data }) => {
  return (
    <>
      {data.map((item, idx) => {
        const isLastItem = data?.length - 1 === idx;
        const { title, content } = item || {};
        return (
          <Fragment key={idx}>
            <TableRow title={title} content={content} />
            {!isLastItem && <Spacer space={20} />}
          </Fragment>
        );
      })}
    </>
  );
};
