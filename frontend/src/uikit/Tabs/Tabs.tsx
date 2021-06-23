import { Fragment } from "react";
import { useState } from "react";
import styled from "styled-components";
import { Flex, Spacer } from "..";
import groupBy from "lodash-es/groupBy";
import flattenDeep from "lodash-es/flattenDeep";

export interface IProps {
  tabs: ITab[];
}

export interface ITab {
  label: string;
  items?: JSX.Element[];
}

export const Tabs: React.FC<IProps> = ({ tabs }) => {
  const [active, setActive] = useState(0);
  const groupedTabs = flattenDeep(
    Object.values(groupBy(tabs, (obj) => obj.label))
  );
  return (
    <Flex column>
      <Flex>
        {groupedTabs.map(({ label }, index) => (
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
        {groupedTabs[active]?.items?.map((item, idx) => (
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
