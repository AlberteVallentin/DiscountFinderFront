import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import facade from '../utils/apiFacade';
import { useAuth } from './AuthContext';

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(new Set());
  const { isAuthenticated } = useAuth();

  const loadFavorites = useCallback(async () => {
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
  }, []); // Tom dependency array da funktionen ikke afhænger af noget

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [isAuthenticated, loadFavorites]);

  const toggleFavorite = async (storeId) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    try {
      const isFavorite = favorites.has(storeId);
      const newFavorites = new Set(favorites);

      if (isFavorite) {
        const result = await facade.removeFavorite(storeId);
        if (result.success) {
          newFavorites.delete(storeId);
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await facade.addFavorite(storeId);
        if (result.success) {
          newFavorites.add(storeId);
        } else {
          throw new Error(result.error);
        }
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
      throw error;
    }
  };

  const isFavorite = (storeId) => favorites.has(storeId);

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
