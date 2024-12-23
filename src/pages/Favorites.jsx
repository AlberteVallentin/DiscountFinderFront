import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import CardGrid from '../components/card/CardGrid';
import StoreCard from '../components/card/StoreCard';
import LoginModal from '../components/modal/LoginModal';
import LoadingSpinner from '../components/LoadingSpinner';
import OutletContainer from '../components/layout/OutletContainer';
import { useAuth } from '../context/AuthContext';
import facade from '../util/apiFacade';
import ProductListModal from '../components/modal/ProductListModal';
import Toast from '../components/Toast';
import EmptyState from '../components/EmptyState';

const Title = styled.h1`
  margin-bottom: 2rem;
`;

function Favorites() {
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      const favorites = await facade.getFavorites();
      setFavoriteStores(
        favorites.map((store) => ({ ...store, isFavorite: true }))
      );
    } catch (err) {
      console.error('Error fetching favorite stores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (storeId, isFavorite) => {
    try {
      // Vi håndterer kun fjernelse her da vi er i Favorites
      await facade.removeFavorite(storeId);

      // Hvis server-kaldet lykkedes, opdaterer vi UI
      setFavoriteStores((prevStores) =>
        prevStores.filter((store) => store.id !== storeId)
      );

      // Vis success toast
      setToast({
        visible: true,
        message: 'Butik fjernet fra favoritter',
        type: 'success',
      });
    } catch (error) {
      console.error('Error removing favorite:', error);

      // Ved fejl, fetch favoritter igen for at sikre korrekt state
      await fetchFavoriteStores();

      setToast({
        visible: true,
        message: 'Der opstod en fejl. Prøv igen senere.',
        type: 'error',
      });
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

  if (error) {
    return <div>Error: {error}</div>;
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
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </OutletContainer>
  );
}

export default Favorites;
