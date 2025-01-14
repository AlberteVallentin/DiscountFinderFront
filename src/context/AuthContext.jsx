import { createContext, useContext, useState, useEffect } from 'react';
import facade from '../utils/apiFacade';

export const AuthContext = createContext(null);

// Basic user type definition
/**
 * @typedef {Object} User
 * @property {string} role - User role
 * @property {string} email - User email
 * @property {string} name - User name
 */

/**
 * Auth provider component
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handles user logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Processes login attempt
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
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Processes registration attempt
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

  // Initialize auth state from stored token
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

  if (loading) {
    return null;
  }

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

// Hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
