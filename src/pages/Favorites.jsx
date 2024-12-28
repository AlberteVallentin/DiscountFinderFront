import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CardGrid from '../components/layout/container/CardGrid';
import StoreCard from '../components/card/StoreCard';
import LoginModal from '../components/modal/LoginModal';
import LoadingSpinner from '../components/feedback/LoadingSpinner';
import OutletContainer from '../components/layout/container/OutletContainer';
import ProductListModal from '../components/modal/ProductListModal';
import EmptyState from '../components/feedback/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../hooks/useToast';
import { useModal } from '../hooks/useModal';
import facade from '../utils/apiFacade';

function Favorites() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const { showToast } = useToast();
  const {
    isOpen: showLoginModal,
    openModal: openLoginModal,
    closeModal: closeLoginModal,
  } = useModal();
  const {
    isOpen: showProductModal,
    openModal: openProductModal,
    closeModal: closeProductModal,
  } = useModal();

  const [{ loading, favoriteStores, selectedStore }, setState] = useState({
    loading: true,
    favoriteStores: [],
    selectedStore: null,
  });

  // Data fetching
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      try {
        const result = await facade.getFavorites();
        setState((prev) => ({
          ...prev,
          favoriteStores: result.success ? result.data : [],
          loading: false,
        }));
      } catch (error) {
        showToast('Der opstod en fejl ved hentning af favoritter', 'error');
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchFavorites();
  }, [isAuthenticated, favorites, showToast]);

  // Modal handlers
  const modalHandlers = {
    openProduct: (store) => {
      setState((prev) => ({ ...prev, selectedStore: store }));
      openProductModal();
    },
    closeProduct: () => {
      setState((prev) => ({ ...prev, selectedStore: null }));
      closeProductModal();
    },
  };

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

  if (loading) {
    return (
      <LoadingSpinner text='Henter favoritbutikker...' fullscreen={true} />
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
              onClick={() => modalHandlers.openProduct(store)}
              onLoginRequired={openLoginModal}
              showToast={showToast}
            />
          ))}
        </CardGrid>
      )}

      {selectedStore && (
        <ProductListModal
          store={selectedStore}
          isOpen={showProductModal}
          onClose={modalHandlers.closeProduct}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        onLogin={() => navigate('/login')}
        message='Du skal være logget ind for at tilføje butikker til favoritter.'
      />
    </OutletContainer>
  );
}

export default Favorites;
