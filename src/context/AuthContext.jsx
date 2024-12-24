import { createContext, useContext, useState, useEffect } from 'react';
import facade from '../utils/apiFacade';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = () => {
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
        setLoading(false); // Opdater loading status
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await facade.login(email, password);
      if (response.token) {
        const decodedToken = facade.decodeToken(response.token);
        setIsAuthenticated(true);
        setUser({
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
        });
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Login fejlede - tjek email og password',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Login fejlede - tjek email og password',
      };
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await facade.register(name, email, password);
      if (response.success) {
        // Hvis registrering lykkedes
        const decodedToken = facade.decodeToken(response.data.token);
        setIsAuthenticated(true);
        setUser({
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
        });
        return { success: true };
      } else {
        // Her sender vi den præcise fejlbesked videre
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Der skete en fejl ved registrering',
      };
    }
  };

  // If we're still loading initial auth state, show nothing
  if (loading) {
    return null;
  }

  const value = {
    isAuthenticated,
    user,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
