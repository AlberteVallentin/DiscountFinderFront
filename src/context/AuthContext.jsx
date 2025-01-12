import { createContext, useContext, useState, useEffect } from 'react';
import facade from '../utils/apiFacade';

// ============= Context Creation =============
export const AuthContext = createContext(null);

// ============= Types =============
/**
 * @typedef {Object} User
 * @property {string} role - User's role (e.g., 'USER', 'ADMIN')
 * @property {string} email - User's email
 * @property {string} name - User's name
 */

/**
 * @typedef {Object} AuthResult
 * @property {boolean} success - Whether the operation was successful
 * @property {string} [error] - Error message if operation failed
 */

/**
 * Provider component for authentication state and operations
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  // ============= State =============
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============= Auth Methods =============
  /**
   * Handles user logout by clearing token and state
   */
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  /**
   * Handles user login
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<AuthResult>} Result of login attempt
   */
  const handleLogin = async (email, password) => {
    try {
      const result = await facade.login(email, password);
      if (result.success) {
        const decodedToken = facade.decodeToken(result.data.token);
        setIsAuthenticated(true);
        setUser({
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
        });
        const email = decodedToken.email;
        sessionStorage.setItem('email', email);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Handles user registration
   * @param {string} name - User's name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<AuthResult>} Result of registration attempt
   */
  const handleRegister = async (name, email, password) => {
    try {
      const result = await facade.register(name, email, password);
      if (result.success) {
        const decodedToken = facade.decodeToken(result.data.token);
        setIsAuthenticated(true);
        setUser({
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
        });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ============= Effects =============
  // Initialize auth state from stored token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const decodedToken = facade.decodeToken(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken && decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUser({
              role: decodedToken.role,
              email: decodedToken.email,
              name: decodedToken.name,
            });
          } else {
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Show loading state while initializing
  if (loading) {
    return null;
  }

  // ============= Context Value =============
  const value = {
    isAuthenticated,
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for accessing auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
