import React, { useState } from "react";
import { Fragment } from "react";
import styled from "styled-components";
import { Flex } from "..";

interface IProps {
  data: ITab[];
}

interface ITab {
  label: string;
  items: string[];
}

export const Tabs = ({ data }: IProps) => {
  const [active, setActive] = useState(0);

  return (
    <Wrapper>
      {data.map((el, idx) => (
        <Flex key={idx}>
          <button onClick={() => setActive(idx)}>{el.label}</button>
        </Flex>
      ))}
      <ul>
        {data[active].items.map((item) => {
          return <li>{item}</li>;
        })}
      </ul>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
