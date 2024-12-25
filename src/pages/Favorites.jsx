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
import { useToast } from '../hooks/useToast';

function Favorites() {
  const navigate = useNavigate();
  const { isAuthenticated, favorites, toggleFavorite } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteStores();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, favorites]);

  const fetchFavoriteStores = async () => {
    try {
      setLoading(true);
      const result = await facade.getFavorites();
      if (result.success) {
        setFavoriteStores(result.data);
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast('Der opstod en fejl ved hentning af favoritter', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (storeId) => {
    try {
      const result = await toggleFavorite(storeId);
      if (result.success) {
        showToast(result.message, 'success');
      } else {
        showToast('Der opstod en fejl', 'error');
      }
    } catch (error) {
      showToast('Der opstod en fejl ved opdatering', 'error');
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
