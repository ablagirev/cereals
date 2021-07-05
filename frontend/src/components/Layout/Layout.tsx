import React from "react";
import { Toast } from "react-bootstrap";
import styled from "styled-components";
import { useAuthContext } from "../../hooks/useAuthContext";
import { TAppNavSection } from "../../routes/models";
import { Flex } from "../../uikit";

import { NavSidebar } from "./NavSidebar";

/**
 * Модель свойств компонента.
 *
 * @prop {TAppNavSection} navigation Конфигурация основной (корневой) навигации приложения.
 */
interface ILayoutProps {
  navigation: TAppNavSection;
}

/**
 * Компонент лейаута страницы приложения.
 */
export const Layout: React.FC<ILayoutProps> = ({ children, navigation }) => {
  const { isAuthenticated } = useAuthContext();
  return (
    <Wrapper>
      {isAuthenticated && <NavSidebar navigation={navigation} />}
      <Content column grow isAuthenticated={isAuthenticated}>
        {children}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Content = styled<any>(Flex)`
  margin-left: ${({ isAuthenticated }) => isAuthenticated && 250}px;
`;
