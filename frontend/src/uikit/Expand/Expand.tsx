import React, { useState } from "react";
import useCollapse from "react-collapsed";
import { Button, ChevronDownIcon, ChevronUpIcon, Flex, Spacer } from "..";
import { Typography } from "../Text";

interface IProps {
  title: string;
}

export const Expand: React.FC<IProps> = ({ title, children, ...rest }) => {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <Flex {...rest} column>
      <Button
        variant="icon"
        {...getToggleProps({
          onClick: () => setExpanded((prevExpanded) => !prevExpanded),
        })}
      >
        <Flex vAlignContent="center">
          {isExpanded ? (
            <ChevronDownIcon size="12" />
          ) : (
            <ChevronUpIcon size="12" />
          )}
          <Spacer width={12} />
          <Typography bold>{title}</Typography>
        </Flex>
      </Button>
      <Flex>
        <Spacer width={30} />
        <section {...getCollapseProps()}>{children}</section>
      </Flex>
    </Flex>
  );
};
