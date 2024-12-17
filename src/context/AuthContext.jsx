import { createContext, useContext, useState, useEffect } from 'react';
import facade from '../util/apiFacade';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check token on mount and validate it
    const initializeAuth = () => {
      const token = facade.getToken();
      if (token) {
        try {
          const decodedToken = facade.decodeToken(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUser({
              role: decodedToken.role,
              email: decodedToken.email,
              name: decodedToken.name,
            });
          } else {
            // Token er udløbet
            facade.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          facade.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    facade.setToken(token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    facade.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
