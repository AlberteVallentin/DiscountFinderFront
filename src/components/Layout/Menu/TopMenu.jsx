import React, { useState } from 'react';
import styled from 'styled-components';
import ThemeSwitcher from '../../ThemeSwitcher';
import SideMenu from './SideMenu';
import Icon from '../../ui/Icon';

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.card};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  height: 5rem;
  background-color: ${({ theme }) => theme.colors.header};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  position: relative;
  z-index: 100;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  position: relative;
  z-index: 200;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TopMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Header>
      <Nav>
        <MenuButton onClick={toggleMenu}>
          <Icon name={isMenuOpen ? 'X' : 'Menu'} size='m' />
        </MenuButton>
        <RightSection>
          <ThemeSwitcher />
        </RightSection>
      </Nav>
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </Header>
  );
};

export default TopMenu;
