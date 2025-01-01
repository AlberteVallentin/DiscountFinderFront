import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import Switch from './Switch';
import { Sun, Moon } from 'lucide-react';
import styled from 'styled-components';

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const StyledIcon = styled.div`
  svg {
    width: var(--fs-m);
    height: var(--fs-m);
  }
`;

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme.isDark;

  return (
    <ThemeToggle>
      <StyledIcon>
        <Sun />
      </StyledIcon>
      <Switch isToggled={isDark} onToggle={toggleTheme} />
      <StyledIcon>
        <Moon />
      </StyledIcon>
    </ThemeToggle>
  );
};

export default ThemeSwitcher;
