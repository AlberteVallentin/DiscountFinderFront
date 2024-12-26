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
import { useFavorites } from '../context/FavoritesContext';

function Favorites() {
  // 1. Først deklarerer vi ALLE hooks
  const { showToast } = useOutletContext();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, favorites } = useFavorites();
  const handleError = useErrorHandler(showToast);
  const [isUpdating, setIsUpdating] = useState(false);
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  // 2. useEffect for at hente favoritter når komponenten indlæses
  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated) {
        const result = await handleError(facade.getFavorites());
        if (result.success) {
          setFavoriteStores(result.data);
        }
        setLoading(false);
      }
    };
    loadFavorites();
  }, [isAuthenticated, favorites]);

  // 3. Betingede returns
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

  // 4. Hovedrender
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
