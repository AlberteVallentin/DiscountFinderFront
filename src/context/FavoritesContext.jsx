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

/**
 * Provider component for managing favorite stores functionality
 * Handles state management and API interactions for user favorites
 */
export const FavoritesProvider = ({ children }) => {
  // ============= State =============
  // Stores set of favorite store IDs
  const [favorites, setFavorites] = useState(new Set());
  const { isAuthenticated } = useAuth();

  // ============= API Interactions =============
  /**
   * Loads user's favorite stores from API
   * @returns {Promise<boolean>} Success status of the operation
   */
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
  }, []);

  // Load favorites when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [isAuthenticated, loadFavorites]);

  // ============= Favorite Management =============
  /**
   * Toggles favorite status for a store
   * @param {string} storeId - ID of store to toggle
   * @returns {Promise<Object>} Result object with success status and message
   */
  const toggleFavorite = async (storeId) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    try {
      const isFavorite = favorites.has(storeId);
      const newFavorites = new Set(favorites);

      // Handle remove favorite
      if (isFavorite) {
        const result = await facade.removeFavorite(storeId);
        if (result.success) {
          newFavorites.delete(storeId);
        } else {
          throw new Error(result.error);
        }
      }
      // Handle add favorite
      else {
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

  /**
   * Checks if a store is marked as favorite
   * @param {string} storeId - Store ID to check
   * @returns {boolean} True if store is a favorite
   */
  const isFavorite = (storeId) => favorites.has(storeId);

  // ============= Context Value =============
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

/**
 * Custom hook for accessing favorites functionality
 * @throws {Error} When used outside FavoritesProvider
 * @returns {Object} Favorites context value
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
