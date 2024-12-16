import { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/Theme';
import facade from '../util/apiFacade';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(lightTheme);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = facade.getToken();
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme.isDark ? lightTheme : darkTheme);
  };

  const value = {
    theme,
    toggleTheme,
    loggedIn,
    setLoggedIn,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
