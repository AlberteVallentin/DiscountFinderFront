// ============= Imports =============
import { createContext, useContext, useState } from 'react';
import { lightTheme, darkTheme } from '../styles/Theme';

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
  const [theme, setTheme] = useState(lightTheme);

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
