import { useTheme } from '../context/ThemeContext';
import Switch from './Switch';
import { Sun, Moon } from 'lucide-react';
import styled from 'styled-components';

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  color: ${({ theme }) =>
    theme.isDark ? 'var(--text-color-dark)' : 'var(--text-color-light)'};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ThemeToggle>
      <Sun />
      <Switch isToggled={isDark} onToggle={toggleTheme} />
      <Moon />
    </ThemeToggle>
  );
};

export default ThemeSwitcher;
