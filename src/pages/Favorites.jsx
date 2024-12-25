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
import Toast from '../components/Toast';
import EmptyState from '../components/EmptyState';
import { useToast } from '../hooks/useToast';
import { useOutletContext } from 'react-router';

function Favorites() {
  const { showToast } = useOutletContext();
  const navigate = useNavigate();
  const { isAuthenticated, favorites, toggleFavorite } = useAuth();
  //const { toast, showToast, hideToast } = useToast();

  const [favoriteStores, setFavoriteStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    console.log('useEffect running - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      fetchFavoriteStores();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
        // Fjern butikken fra favoriteStores
        setFavoriteStores((prevStores) =>
          prevStores.filter((store) => store.id !== storeId)
        );
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
    </OutletContainer>
  );
}

export default Favorites;
