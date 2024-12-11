import React, { useState } from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import ThemeSwitcher from './ThemeSwitcher';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  height: 10vh;
  background-color: ${({ theme }) => theme.colors.header};
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  z-index: 100;
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 40;
`;

const SideMenu = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-300px')};
  width: 300px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  padding: 5rem 1rem 1rem;
  transition: left 0.3s ease;
  z-index: 50;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin: 1rem 0;

  a {
    display: block;
    padding: 0.75rem 1rem;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) =>
        theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) =>
        theme.isDark ? theme.colors.background : theme.colors.card};
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

function TopMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <StyledNav theme={theme}>
        <MenuButton onClick={toggleMenu} theme={theme}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuButton>
        <RightSection>
          <ThemeSwitcher />
        </RightSection>
      </StyledNav>

      <MenuOverlay isOpen={isMenuOpen} onClick={closeMenu} />

      <SideMenu isOpen={isMenuOpen} theme={theme}>
        <StyledMenu>
          <MenuItem theme={theme}>
            <NavLink to='/' onClick={closeMenu}>
              Home
            </NavLink>
          </MenuItem>
          <MenuItem theme={theme}>
            <NavLink to='/vision' onClick={closeMenu}>
              Vision
            </NavLink>
          </MenuItem>
          <MenuItem theme={theme}>
            <NavLink to='/endpoints' onClick={closeMenu}>
              Endpoints
            </NavLink>
          </MenuItem>
        </StyledMenu>
      </SideMenu>
    </>
  );
}

export default TopMenu;
