import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { borderRadius } from '../styles/Theme';
import Icon from '../components/ui/Icon';
import facade from '../utils/apiFacade';
import styled from 'styled-components';
import ScrollToTop from '../components/ScrollToTop';
import LoadingSpinner from '../components/LoadingSpinner';
import StoreCard from '../components/card/StoreCard';
import CardGrid from '../components/card/CardGrid';
import ProductListModal from '../components/modal/ProductListModal';
import SearchBar from '../components/ui/SearchBar';
import BrandButton from '../components/button/BrandButton';
import OutletContainer from '../components/layout/OutletContainer';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/modal/LoginModal';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    right: 1rem;
    bottom: 1.1rem;
    pointer-events: none;
  }
`;

const PostalCodeSelect = styled.select`
  color: ${({ theme }) => theme.colors.buttonText};
  background: ${({ theme }) => theme.colors.buttonColor};
  border: none;
  border-radius: ${borderRadius.round};
  padding: 1rem 2rem;
  padding-right: 3rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
  }
`;

const BrandSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

function Stores() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // States
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostalCode, setSelectedPostalCode] = useState('');
  const [postalCodes, setPostalCodes] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedStore, setSelectedStore] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const storesResult = await facade.getAllStores();

      if (!storesResult.success) {
        showToast(storesResult.error, 'error');
        return;
      }

      let favoriteIds = new Set();
      if (isAuthenticated) {
        const favoritesResult = await facade.getFavorites();
        if (favoritesResult.success) {
          favoriteIds = new Set(favoritesResult.data.map((fav) => fav.id));
        }
      }

      const storesWithFavorites = storesResult.data.map((store) => ({
        ...store,
        isFavorite: favoriteIds.has(store.id),
      }));

      setStores(storesWithFavorites);
      setFilteredStores(storesWithFavorites);

      const uniquePostalCodes = [
        ...new Set(
          storesWithFavorites.map(
            (store) => store.address.postalCode.postalCode
          )
        ),
      ].sort();

      setPostalCodes(uniquePostalCodes);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [isAuthenticated]);

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleFavoriteToggle = async (storeId, isFavorite) => {
    try {
      const result = isFavorite
        ? await facade.addFavorite(storeId)
        : await facade.removeFavorite(storeId);

      if (result.success) {
        showToast(
          isFavorite
            ? 'Butik tilføjet til favoritter'
            : 'Butik fjernet fra favoritter',
          'success'
        );

        setStores((prev) =>
          prev.map((store) =>
            store.id === storeId ? { ...store, isFavorite } : store
          )
        );
        setFilteredStores((prev) =>
          prev.map((store) =>
            store.id === storeId ? { ...store, isFavorite } : store
          )
        );
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast('Der opstod en fejl', 'error');
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterStores(term, selectedPostalCode, selectedBrands);
  };

  const handlePostalCodeChange = async (event) => {
    const postalCode = event.target.value;
    setSelectedPostalCode(postalCode);
    setLoading(true);

    try {
      if (postalCode) {
        const result = await facade.getStoresByPostalCode(postalCode);
        if (!result.success) {
          showToast(result.error, 'error');
          return;
        }

        const storesWithFavorites = result.data.map((newStore) => {
          const existingStore = stores.find(
            (store) => store.id === newStore.id
          );
          return {
            ...newStore,
            isFavorite: existingStore ? existingStore.isFavorite : false,
          };
        });

        setFilteredStores(
          selectedBrands.size > 0
            ? storesWithFavorites.filter((store) =>
                selectedBrands.has(store.brand.displayName)
              )
            : storesWithFavorites
        );
      } else {
        filterStores(searchTerm, '', selectedBrands);
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brand) => {
    const newSelectedBrands = new Set(selectedBrands);
    if (selectedBrands.has(brand)) {
      newSelectedBrands.delete(brand);
    } else {
      newSelectedBrands.add(brand);
    }
    setSelectedBrands(newSelectedBrands);
    filterStores(searchTerm, selectedPostalCode, newSelectedBrands);
  };

  const filterStores = (search, postalCode, brands) => {
    let filtered = stores;

    if (search) {
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.brand.displayName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (postalCode) {
      filtered = filtered.filter(
        (store) => store.address.postalCode.postalCode === parseInt(postalCode)
      );
    }

    if (brands?.size > 0) {
      filtered = filtered.filter((store) =>
        brands.has(store.brand.displayName)
      );
    }

    setFilteredStores(filtered);
  };

  if (loading) {
    return <LoadingSpinner text='Henter butikker...' fullscreen={true} />;
  }

  return (
    <OutletContainer>
      <SearchSection>
        <SearchBar
          placeholder='Søg efter en butik...'
          value={searchTerm}
          onChange={handleSearch}
        />
        <SelectWrapper>
          <PostalCodeSelect
            value={selectedPostalCode}
            onChange={handlePostalCodeChange}
          >
            <option value=''>Alle postnumre</option>
            {postalCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </PostalCodeSelect>
          <Icon name='ChevronDown' size='m' color='buttonText' />
        </SelectWrapper>
      </SearchSection>

      <BrandSection>
        <BrandButton
          active={selectedBrands.has('Netto')}
          onClick={() => handleBrandClick('Netto')}
        >
          Netto
        </BrandButton>
        <BrandButton
          onClick={() => handleBrandClick('Føtex')}
          active={selectedBrands.has('Føtex')}
        >
          Føtex
        </BrandButton>
        <BrandButton
          onClick={() => handleBrandClick('Bilka')}
          active={selectedBrands.has('Bilka')}
        >
          Bilka
        </BrandButton>
      </BrandSection>

      <CardGrid>
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onClick={() => setSelectedStore(store)}
            onFavoriteToggle={handleFavoriteToggle}
            onLoginRequired={handleLoginRequired}
            showToast={showToast}
          />
        ))}
      </CardGrid>

      {selectedStore && (
        <ProductListModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={() => navigate('/login')}
          message='Du skal være logget ind for at tilføje butikker til favoritter.'
        />
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <ScrollToTop />
    </OutletContainer>
  );
}

export default Stores;
