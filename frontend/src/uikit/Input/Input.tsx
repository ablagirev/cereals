import React from "react";
import { Field } from "formik";
import { EMPTY_CHAR } from "../../utils/consts";
import styled from "styled-components";
import { Spacer } from "..";

interface IProps {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
}

export const Input: React.FC<IProps> = ({
  name,
  placeholder = EMPTY_CHAR,
  label,
  type,
}) => (
  <>
    {label && (
      <>
        <label htmlFor={name}>{label}</label>
        <Spacer space={4} />
      </>
    )}
    <StyledField id={name} name={name} placeholder={placeholder} type={type} />
  </>
);

const StyledField = styled(Field)`
  min-width: 345px;
  height: 50px;
  border: 0px;
  background-color: #e7e2d4;
  border-radius: 6px;
  color: #333333;
`;
