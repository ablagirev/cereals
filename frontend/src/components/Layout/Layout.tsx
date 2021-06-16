import React from "react";
import styled from "styled-components";
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
  isAuthenticated: boolean;
}

/**
 * Компонент лейаута страницы приложения.
 */
export const Layout: React.FC<ILayoutProps> = ({
  children,
  navigation,
  isAuthenticated,
}) => {
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
  height: 75px;
`;
