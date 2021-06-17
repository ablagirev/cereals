import React from "react";
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
    <Flex fillHeight>
      {isAuthenticated && <NavSidebar navigation={navigation} />}
      <Flex column grow>
        <PageHeader />
        {children}
      </Flex>
    </Flex>
  );
};

const PageHeader = styled.div`
  height: 44px;
`;
