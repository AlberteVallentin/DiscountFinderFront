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

const Title = styled.h1`
  margin-bottom: 2rem;
`;

function Favorites() {
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
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
      if (!isFavorite) {
        await facade.removeFavorite(storeId);
        setFavoriteStores((prevStores) =>
          prevStores.filter((store) => store.id !== storeId)
        );
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
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
        onLogin={() => navigate('/login')}
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
