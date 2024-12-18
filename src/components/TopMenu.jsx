import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import styled from 'styled-components';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../context/AuthContext';
import Icon from './ui/Icon';

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 1rem;
  height: 10vh;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.header};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
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
  background-color: ${({ theme }) => theme.colors.overlay};
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
  padding: 6rem 1rem 1rem;
  transition: left 0.4s ease;
  z-index: 50;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const StyledMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin: 1rem 0;

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: var(--fs-m);
    font-weight: var(--fw-medium);
    padding-left: 1rem;
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.4s ease;

    svg {
      width: var(--fs-n);
      height: var(--fs-n);
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 6px;
`;

function TopMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <StyledNav>
        <MenuButton onClick={toggleMenu}>
          <Icon name={isMenuOpen ? 'X' : 'Menu'} size='m' />
        </MenuButton>
        <RightSection>
          <ThemeSwitcher />
        </RightSection>
      </StyledNav>

      <MenuOverlay isOpen={isMenuOpen} onClick={closeMenu} />

      <SideMenu isOpen={isMenuOpen}>
        <StyledMenu>
          <MenuItem>
            <StyledNavLink to='/' onClick={closeMenu}>
              <Icon name='Home' />
              Home
            </StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to='/stores' onClick={closeMenu}>
              <Icon name='Search' />
              Find butikker
            </StyledNavLink>
          </MenuItem>
          <MenuItem>
            {isAuthenticated ? (
              <StyledNavLink
                to='/'
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
              >
                <Icon name='User' />
                Log ud
              </StyledNavLink>
            ) : (
              <StyledNavLink to='/login' onClick={closeMenu}>
                <Icon name='User' />
                Login / Opret
              </StyledNavLink>
            )}
          </MenuItem>
        </StyledMenu>
      </SideMenu>
    </>
  );
}

export default TopMenu;
