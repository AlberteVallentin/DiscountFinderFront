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
  const { isAuthenticated, isFavorite, favorites } = useAuth();
  const handleError = useErrorHandler(showToast);
  const [isUpdating, setIsUpdating] = useState(false);

  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteStores();
    }
  }, [isAuthenticated, favorites]);

  const fetchFavoriteStores = async () => {
    const result = await handleError(facade.getFavorites());
    if (result.success) {
      setFavoriteStores(result.data);
    }
    setLoading(false);
  };

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
