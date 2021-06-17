import React from "react";
import ReactSelect from "react-select";

interface ISelect {
  value: string;
  label: string;
}

interface IProps {
  options: ISelect[];
}

export const Select: React.FC<IProps> = ({ options, ...rest }) => (
  <ReactSelect options={options} {...rest} />
);
