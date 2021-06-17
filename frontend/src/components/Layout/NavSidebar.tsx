import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { usePermissions } from "../../hooks/usePermissions";
import { TAppNavItem, TAppNavSection } from "../../routes/models";
import { theme } from "../../theme";
import { Flex, Spacer } from "../../uikit";
import { hasPermissions } from "../../utils";
import { EMPTY_CHAR } from "../../utils/consts";
import { NavSidebarItem } from "./NavSidebarItem";

/**
 * Модель свойств компонента.
 *
 * @prop {TAppNavSection} navigation Конфигурация основной (корневой) навигации приложения.
 */
interface IProps {
  navigation: TAppNavSection;
}

/**
 * Отображает разворачиваемую панель с основным меню.
 */
export const NavSidebar: React.FC<IProps> = ({ navigation }) => {
  const userPermissions = usePermissions();
  const [activeSection, setActiveSection] = useState(EMPTY_CHAR);

  const { items, label } = navigation;

  const itemsWithPermissions = items.filter(
    (item: TAppNavItem) =>
      !item?.element?.hidden &&
      hasPermissions(userPermissions, item.allowed) &&
      item
  );
  return (
    <NavSidebarInner>
      <Logo>{navigation.label}</Logo>
      <Fragment key={label}>
        <Flex fillWidth>
          <NavList>
            {itemsWithPermissions.map((item: TAppNavItem) => {
              return (
                <NavSidebarItem
                  currentSection={label}
                  key={item.path}
                  navItem={item}
                  onItemClick={(val) => setActiveSection(val)}
                />
              );
            })}
          </NavList>
          <Spacer width={theme.spacings.s} />
        </Flex>
      </Fragment>
    </NavSidebarInner>
  );
};

const NavList = styled.ul`
  width: 100%;
`;

const NavSidebarInner = styled.div`
  padding-top: 33px;
  padding-left: 25px;
  height: 100%;
  width: 250px;
  background-color: #e7e2d1;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 18px;
  padding-bottom: 130px;
`;
