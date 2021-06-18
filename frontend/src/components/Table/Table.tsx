import { FC, Fragment } from "react";
import { Spacer } from "../../uikit";
import { ITableRow, TableRow } from "./TableRow";

interface IProps {
  data: ITableRow[];
}

export const Table: FC<IProps> = ({ data }) => {
  return (
    <>
      {data.map((item, idx) => {
        const { title, content } = item || {};
        return (
          <Fragment key={idx}>
            <TableRow title={title} content={content} />
            <Spacer space={20} />
          </Fragment>
        );
      })}
    </>
  );
};
