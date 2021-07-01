import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { Flex } from "..";

export const Loader: React.FC = () => {
  return (
    <Flex vAlignContent="center" hAlignContent="center" fillHeight fillWidth>
      <Spinner animation="border" variant="primary" />
    </Flex>
  );
};
