import React from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import ThemeSwitcher from './ThemeSwitcher';

import { ThemeProvider, useTheme } from '../context/ThemeContext.jsx';

const StyledMenu = styled.ul`
  display: flex;
  list-style: none;
  gap: 15px;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 20px;
  height: 10vh;
  background-color: ${({ theme }) => theme.colors.header};
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

function TopMenu() {
  const { theme, toggleTheme } = useTheme();

  return (
    <StyledNav theme={theme}>
      <StyledMenu>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/vision'>Vision</NavLink>
        </li>
        <li>
          <NavLink to='/endpoints'>Endpoints</NavLink>
        </li>
      </StyledMenu>
      <ThemeSwitcher />
    </StyledNav>
  );
}

export default TopMenu;
