import React, { useState } from "react";
import { matchPath, NavLink } from "react-router-dom";
import styled from "styled-components";
import { TAppNavItem } from "../../routes/models";

/**
 * Модель свойств компонента.
 *
 * @prop {TAppNavItem} navItem Параметры навигации.
 * @prop {string} currentSection Название текущей секции.
 * @prop {Function} onItemClick Хендлер клика на элемент.
 */
interface INavSidebarItemProps {
  navItem: TAppNavItem;
  currentSection: string;
  onItemClick: (val: string) => void;
}

/**
 * Компонент элемента главного меню.
 */
export const NavSidebarItem: React.FC<INavSidebarItemProps> = ({ navItem }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <StyledListItem>
      <StyledNavLink
        exact
        to={navItem.path}
        title={navItem?.element?.label}
        isActive={(_match, activeLocation) => {
          const isChosen = !!matchPath(activeLocation.pathname, {
            path: navItem.path,
            exact: false,
            strict: false,
          });
          setIsActive(isChosen);
          return isChosen;
        }}
      >
        {navItem?.element?.label && (
          <NavItem isActive={isActive}>{navItem.element.label}</NavItem>
        )}
      </StyledNavLink>
    </StyledListItem>
  );
};

const StyledListItem = styled.li`
  padding-bottom: 20px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
`;

const NavItem = styled.span<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? "#8E66FE" : "#191919")};
`;
