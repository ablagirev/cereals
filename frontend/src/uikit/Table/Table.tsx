import { FC, Fragment } from "react";
import { Spacer } from "..";
import { ITableRow, TableRow } from "./TableRow";

interface IProps {
  data: ITableRow[];
}

export const Table: FC<IProps> = ({ data }) => {
  return (
    <table>
      {data.map((item, idx) => {
        const { title, content } = item || {};
        return <TableRow key={idx} title={title} content={content} />;
      })}
    </table>
  );
};
