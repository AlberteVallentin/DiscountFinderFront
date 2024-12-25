import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CardGrid from '../components/card/CardGrid';
import StoreCard from '../components/card/StoreCard';
import LoginModal from '../components/modal/LoginModal';
import LoadingSpinner from '../components/LoadingSpinner';
import OutletContainer from '../components/layout/OutletContainer';
import { useAuth } from '../context/AuthContext';
import facade from '../utils/apiFacade';
import ProductListModal from '../components/modal/ProductListModal';
import EmptyState from '../components/EmptyState';
import { useErrorHandler } from '../utils/errorHandler';
import { useOutletContext } from 'react-router';

function Favorites() {
  const { showToast } = useOutletContext();
  const navigate = useNavigate();
  const { isAuthenticated, toggleFavorite } = useAuth();
  const handleError = useErrorHandler(showToast);
  const [isUpdating, setIsUpdating] = useState(false);

  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchFavoriteStores = async () => {
    const result = await handleError(facade.getFavorites());
    if (result.success) {
      setFavoriteStores(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteStores();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleFavoriteToggle = async (storeId) => {
    console.log('Handle favorite toggle called with storeId:', storeId);
    if (!storeId) {
      console.error('Store ID is missing or undefined');
      return;
    }

    try {
      const result = await handleError(toggleFavorite(storeId));
      console.log('Toggle favorite result:', result);
    } catch (error) {
      console.error('Error in handleFavoriteToggle:', error);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner text='Henter favoritbutikker...' fullscreen={true} />
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginModal
        isOpen={true}
        onClose={() => navigate('/stores')}
        onLogin={() =>
          navigate('/login', { state: { returnPath: '/favorites' } })
        }
        message='Du skal være logget ind for at se dine favoritbutikker.'
      />
    );
  }

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
              onLoginRequired={() => {}}
              showToast={showToast}
              onFavoriteToggle={handleFavoriteToggle}
              disabled={isUpdating}
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
