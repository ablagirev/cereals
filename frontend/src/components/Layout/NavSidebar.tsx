import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useLogout } from "../../hooks/useAuth";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import { routes } from "../../routes/consts";
import { TAppNavItem, TAppNavSection } from "../../routes/models";
import { theme } from "../../theme";
import { Flex, Spacer } from "../../uikit";
import { hasPermissions } from "../../utils";
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
  const { logout } = useAuthContext();
  const userPermissions = usePermissions();
  const { refetch: triggerLogout } = useLogout();

  const { items, label } = navigation;

  const itemsWithPermissions = items.filter(
    (item: TAppNavItem) =>
      !item?.element?.hidden &&
      hasPermissions(userPermissions, item.allowed) &&
      item
  );

  const handleLogout = () => {
    triggerLogout() && logout();
  };

  return (
    <NavSidebarInner>
      <div>
        <Logo>{navigation.label}</Logo>
        <Flex fillWidth>
          <NavList>
            {itemsWithPermissions.map((item: TAppNavItem) => {
              return (
                <NavSidebarItem
                  currentSection={label}
                  key={item.path}
                  navItem={item}
                />
              );
            })}
          </NavList>
          <Spacer width={theme.spacings.s} />
        </Flex>
      </div>
      <StyledNavLink exact to={routes.root.path} onClick={handleLogout}>
        <span>Выйти</span>
      </StyledNavLink>
    </NavSidebarInner>
  );
};

const StyledNavLink = styled(NavLink)`
  color: #191919;
  margin-bottom: 150px;
`;

const NavList = styled.ul`
  width: 100%;
`;

const NavSidebarInner = styled.div`
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  padding: 33px 25px;
  width: 250px;
  background-color: #e7e2d1;
  white-space: nowrap;
  z-index: 1;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 18px;
  padding-bottom: 130px;
`;
