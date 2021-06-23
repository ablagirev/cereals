import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { IRouteParams } from "../../../utils/models";
import { getDealingsRoutes } from "../navigation";

export const OffersTemplate: React.FC = () => {
  const { id }: IRouteParams = useParams() || {};
  return <Wrapper>{getDealingsRoutes({ id })}</Wrapper>;
};

const Wrapper = styled.div`
  margin-left: 70px;
`;
