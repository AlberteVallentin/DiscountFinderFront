import React from 'react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import Switch from './Switch';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import { ThemeProvider, useTheme } from '../context/ThemeContext.jsx';

const StyledMenu = styled.ul`
  display: flex;
  list-style: none;
  gap: 15px;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 10vh;
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

function TopMenu() {
  const { theme, toggleTheme } = useTheme();

  return (
    <StyledNav>
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
      <ThemeToggle>
        <SunIcon />
        <Switch isToggled={theme.isDark} onToggle={toggleTheme} />
        <MoonIcon />
      </ThemeToggle>
    </StyledNav>
  );
}

export default TopMenu;
