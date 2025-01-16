import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router';
import { useFavorites } from '../context/FavoritesContext';
import { useErrorHandler } from '../utils/errorHandler';
import facade from '../utils/apiFacade';
import CardGrid from '../components/layout/container/CardGrid';
import StoreCard from '../components/card/StoreCard';
import LoadingSpinner from '../components/feedback/LoadingSpinner';
import OutletContainer from '../components/layout/container/OutletContainer';
import ProductListModal from '../components/modal/ProductListModal';
import EmptyState from '../components/feedback/EmptyState';

/**
 * Favorites page component
 * Displays and manages user's favorite stores with options to view products
 */
function Favorites() {
  // ============= Hooks =============
  const { showToast } = useOutletContext();
  const navigate = useNavigate();
  const { isFavorite, favorites } = useFavorites();
  const handleError = useErrorHandler(showToast);

  // ============= State =============
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  // ============= Effects =============
  /**
   * Fetches favorite stores when component mounts or favorites change
   */
  useEffect(() => {
    const loadFavorites = async () => {
      const result = await handleError(facade.getFavorites());
      if (result.success) {
        setFavoriteStores(result.data);
      }
      setLoading(false);
    };
    loadFavorites();
  }, [favorites]);

  // ============= Conditional Rendering =============
  if (loading) {
    return (
      <LoadingSpinner text='Henter favoritbutikker...' fullscreen={true} />
    );
  }

  // ============= Main Render =============
  return (
    <OutletContainer>
      <h1>Mine favoritbutikker</h1>
      {favoriteStores.length === 0 ? (
        <EmptyState type='NO_FAVORITES' />
      ) : (
        <CardGrid>
          {favoriteStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onClick={() => setSelectedStore(store)}
              onLoginRequired={() => navigate('/login')}
              showToast={showToast}
            />
          ))}
        </CardGrid>
      )}
      {selectedStore && (
        <ProductListModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </OutletContainer>
  );
}

export default Favorites;
