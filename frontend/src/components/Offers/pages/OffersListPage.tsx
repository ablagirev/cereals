import React from "react";
import { Flex, Tabs, Typography } from "../../../uikit";

const data = [
  {
    label: "test label 1",
    items: ["item1 form label 1", "item2 from label 1"],
  },
  {
    label: "test label 2",
    items: ["item1 form label 2", "item2 from label 2"],
  },
];

export const OffersListPage: React.FC = () => {
  return (
    <Flex column>
      <Typography size="lg2" bold>
        Мои предложения
      </Typography>
      <Tabs data={data} />
    </Flex>
  );
};
