// ============= Imports =============
import { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/Theme';
import facade from '../utils/apiFacade';

// ============= Context Creation =============
/**
 * Context for managing theme state across the application
 * Provides theme object and functions to toggle between light/dark modes
 */
export const ThemeContext = createContext();

// ============= Provider Component =============
/**
 * Theme provider wrapper component
 * Manages theme state and provides theme context to child components
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap with theme context
 * @returns {JSX.Element} ThemeProvider component
 */
export function ThemeProvider({ children }) {
  // ============= State =============
  // Track current theme and authentication status
  const [theme, setTheme] = useState(lightTheme);
  const [loggedIn, setLoggedIn] = useState(false);

  // ============= Effects =============
  // Check authentication status on mount
  useEffect(() => {
    const token = facade.getToken();
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  // ============= Event Handlers =============
  /**
   * Toggles between light and dark theme
   * Uses theme.isDark property to determine current theme
   */
  const toggleTheme = () => {
    setTheme(theme.isDark ? lightTheme : darkTheme);
  };

  // ============= Context Value =============
  const value = {
    theme,
    toggleTheme,
    loggedIn,
    setLoggedIn,
  };

  // ============= Render =============
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ============= Custom Hook =============
/**
 * Custom hook to use theme context
 * Provides easy access to theme context values and functions
 * @returns {Object} Theme context value
 * @throws {Error} If used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
