import { Fragment } from "react";
import { ReactNode, useState } from "react";
import styled from "styled-components";
import { Flex, Spacer } from "..";

interface IProps {
  tabs: ITab[];
}

interface ITab {
  label: string;
  items: ReactNode[];
}

export const Tabs: React.FC<IProps> = ({ tabs }) => {
  const [active, setActive] = useState(0);
  return (
    <Flex column>
      <Flex>
        {tabs.map(({ label }, index) => (
          <TabFilter
            key={index}
            isActive={active === index}
            onClick={() => setActive(index)}
          >
            {label}
          </TabFilter>
        ))}
      </Flex>
      <Spacer space={40} />
      <Flex column>
        {tabs[active].items.map((item, idx) => (
          <Fragment key={idx}>
            <Flex>{item}</Flex>
            <Spacer space={10} />
          </Fragment>
        ))}
      </Flex>
      <Spacer space={28} />
    </Flex>
  );
};

const TabFilter = styled.div<{ isActive: boolean }>`
  font-size: 16px;
  opacity: ${({ isActive }) => (isActive ? "initial" : 0.5)};
  cursor: pointer;
  margin-right: 30px;
`;
