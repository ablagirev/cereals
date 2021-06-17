import React from "react";
import styled from "styled-components";
import { getDealingsRoutes } from "../navigation";

export const OffersTemplate: React.FC = () => {
  return <Wrapper>{getDealingsRoutes()}</Wrapper>;
};

const Wrapper = styled.div`
  margin-left: 70px;
`;
