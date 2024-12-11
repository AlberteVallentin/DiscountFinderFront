import { useTheme } from '../context/ThemeContext';
import Switch from './Switch';
import { Sun, Moon } from 'lucide-react';
import styled from 'styled-components';

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();
  const { theme } = useTheme();

  return (
    <ThemeToggle theme={theme}>
      <Sun />
      <Switch isToggled={isDark} onToggle={toggleTheme} />
      <Moon />
    </ThemeToggle>
  );
};

export default ThemeSwitcher;
