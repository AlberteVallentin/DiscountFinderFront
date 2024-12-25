import { createContext, useContext, useState, useEffect } from 'react';
import facade from '../utils/apiFacade';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setUser(null);
    setFavorites(new Set()); // Clear favorites on logout
  };

  // Initialize auth state when app starts
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
            await loadFavorites(); // Load favorites if user is authenticated
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

  const loadFavorites = async () => {
    try {
      const result = await facade.getFavorites();
      if (result.success) {
        const favoriteIds = new Set(result.data.map((store) => store.id));
        setFavorites(favoriteIds);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading favorites:', error);
      return false;
    }
  };

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
        await loadFavorites();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

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
        await loadFavorites();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (storeId) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    try {
      const isFavorite = favorites.has(storeId);
      const newFavorites = new Set(favorites);

      if (isFavorite) {
        await facade.removeFavorite(storeId);
        newFavorites.delete(storeId);
      } else {
        await facade.addFavorite(storeId);
        newFavorites.add(storeId);
      }

      setFavorites(newFavorites);
      return {
        success: true,
        isFavorite: !isFavorite,
        message: !isFavorite
          ? 'Butik tilføjet til favoritter'
          : 'Butik fjernet fra favoritter',
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error: error.message };
    }
  };

  const isFavorite = (storeId) => favorites.has(storeId);

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
    toggleFavorite,
    isFavorite,
    favorites,
    loadFavorites, // Expose this in case we need to reload favorites
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
