import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import CardGrid from '../components/card/CardGrid';
import StoreCard from '../components/card/StoreCard';
import LoginModal from '../components/modal/LoginModal';
import LoadingSpinner from '../components/LoadingSpinner';
import OutletContainer from '../components/layout/OutletContainer';
import { useAuth } from '../context/AuthContext';
import facade from '../utils/apiFacade';
import ProductListModal from '../components/modal/ProductListModal';
import Toast from '../components/Toast';
import EmptyState from '../components/EmptyState';
import { useErrorHandler } from '../utils/errorHandler';
import { useToast } from '../hooks/useToast';

const Title = styled.h1`
  margin-bottom: 2rem;
`;

function Favorites() {
  // States
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  // Hooks
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const handleError = useErrorHandler(showToast);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteStores();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchFavoriteStores = async () => {
    try {
      setLoading(true);
      const favorites = await handleError(facade.getFavorites());
      setFavoriteStores(
        favorites.map((store) => ({ ...store, isFavorite: true }))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (storeId) => {
    try {
      await handleError(facade.removeFavorite(storeId));

      // Update UI optimistically
      setFavoriteStores((prevStores) =>
        prevStores.filter((store) => store.id !== storeId)
      );

      showToast('Butik fjernet fra favoritter', 'success');
    } catch (error) {
      // Reload favorites to ensure correct state
      await fetchFavoriteStores();
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
          navigate('/login', {
            state: { returnPath: '/favorites' },
          })
        }
        message='Du skal være logget ind for at se dine favoritbutikker.'
      />
    );
  }

  return (
    <OutletContainer>
      <Title>Mine favoritbutikker</Title>

      {favoriteStores.length === 0 ? (
        <EmptyState type='NO_FAVORITES' />
      ) : (
        <CardGrid>
          {favoriteStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onClick={() => setSelectedStore(store)}
              onFavoriteToggle={handleFavoriteToggle}
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

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </OutletContainer>
  );
}

export default Favorites;
