import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useSearch } from '../hooks/useSearch';
import facade from '../utils/apiFacade';
import ScrollToTop from '../components/layout/navigation/ScrollToTop';
import LoadingSpinner from '../components/feedback/LoadingSpinner';
import StoreCard from '../components/card/StoreCard';
import CardGrid from '../components/layout/container/CardGrid';
import ProductListModal from '../components/modal/ProductListModal';
import SearchBar from '../components/controls/SearchBar';
import BrandButton from '../components/button/BrandButton';
import OutletContainer from '../components/layout/container/OutletContainer';
import LoginModal from '../components/modal/LoginModal';
import { useFavorites } from '../context/FavoritesContext';
import SortDropdown from '../components/controls/dropdown/SortDropdown';
import { useToast } from '../hooks/useToast';
import { useModal } from '../hooks/useModal';

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
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
  const { isFavorite } = useFavorites();
  const { showToast } = useToast();

  // Modal states
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

  // Base state
  const [stores, setStores] = useState([]);
  const [postalCodes, setPostalCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedPostalCode, setSelectedPostalCode] = useState('');
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  // Initialize search
  const {
    searchTerm,
    filteredItems: searchFilteredStores,
    handleSearch,
  } = useSearch(stores, {
    keys: ['name', 'brand.displayName'],
  });

  // Initial data fetch
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const result = await facade.getAllStores();

        if (result.success) {
          const storesWithFavorites = result.data.map((store) => ({
            ...store,
            isFavorite: isFavorite(store.id),
          }));

          const uniquePostalCodes = [
            ...new Set(
              storesWithFavorites.map(
                (store) => store.address.postalCode.postalCode
              )
            ),
          ].sort();

          setStores(storesWithFavorites);
          setPostalCodes(uniquePostalCodes);
        } else {
          showToast('Der opstod en fejl ved hentning af butikker', 'error');
        }
      } catch (error) {
        showToast('Der opstod en fejl ved hentning af butikker', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [isFavorite, showToast]);

  // Apply additional filters to search results
  const filteredStores = useMemo(() => {
    let filtered = [...searchFilteredStores];

    if (selectedPostalCode) {
      filtered = filtered.filter(
        (store) =>
          store.address.postalCode.postalCode === parseInt(selectedPostalCode)
      );
    }

    if (selectedBrands.size > 0) {
      filtered = filtered.filter((store) =>
        selectedBrands.has(store.brand.displayName)
      );
    }

    return filtered;
  }, [searchFilteredStores, selectedPostalCode, selectedBrands]);

  // Create postal code options
  const postalCodeOptions = useMemo(
    () => [
      { value: '', label: 'Alle postnumre' },
      ...postalCodes.map((code) => ({
        value: code.toString(),
        label: code.toString(),
      })),
    ],
    [postalCodes]
  );

  // Event handlers
  const handleSearchChange = (event) => {
    handleSearch(event.target.value);
  };

  const handlePostalCodeChange = async (postalCode) => {
    setSelectedPostalCode(postalCode);

    if (postalCode) {
      setLoading(true);
      try {
        const result = await facade.getStoresByPostalCode(postalCode);
        if (result.success) {
          const storesWithFavorites = result.data.map((store) => ({
            ...store,
            isFavorite: isFavorite(store.id),
          }));
          setStores(storesWithFavorites);
        } else {
          showToast('Der opstod en fejl ved hentning af butikker', 'error');
        }
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    } else {
      // Reset to all stores
      const result = await facade.getAllStores();
      if (result.success) {
        const storesWithFavorites = result.data.map((store) => ({
          ...store,
          isFavorite: isFavorite(store.id),
        }));
        setStores(storesWithFavorites);
      }
    }
  };

  const handleBrandClick = (brand) => {
    setSelectedBrands((prev) => {
      const newSelectedBrands = new Set(prev);
      if (newSelectedBrands.has(brand)) {
        newSelectedBrands.delete(brand);
      } else {
        newSelectedBrands.add(brand);
      }
      return newSelectedBrands;
    });
  };

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    openProductModal();
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
          onChange={handleSearchChange}
        />
        <SortDropdown
          options={postalCodeOptions}
          selectedOption={selectedPostalCode}
          onSelect={handlePostalCodeChange}
          buttonText='Postnummer'
          icon='MapPin'
        />
      </SearchSection>

      <BrandSection>
        {['Netto', 'Føtex', 'Bilka'].map((brand) => (
          <BrandButton
            key={brand}
            active={selectedBrands.has(brand)}
            onClick={() => handleBrandClick(brand)}
          >
            {brand}
          </BrandButton>
        ))}
      </BrandSection>

      <CardGrid>
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onClick={() => handleStoreClick(store)}
            onLoginRequired={openLoginModal}
            showToast={showToast}
          />
        ))}
      </CardGrid>

      {selectedStore && (
        <ProductListModal
          store={selectedStore}
          isOpen={showProductModal}
          onClose={() => {
            closeProductModal();
            setSelectedStore(null);
          }}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        onLogin={() => navigate('/login')}
        message='Du skal være logget ind for at tilføje butikker til favoritter.'
      />

      <ScrollToTop />
    </OutletContainer>
  );
}

export default Stores;
