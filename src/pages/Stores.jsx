import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import facade from '../utils/apiFacade';
import ScrollToTop from '../components/layout/navigation/ScrollToTop';
import LoadingSpinner from '../components/feedback/LoadingSpinner';
import StoreCard from '../components/card/StoreCard';
import CardGrid from '../components/layout/container/CardGrid';
import ProductListModal from '../components/modal/ProductListModal';
import SearchBar from '../components/ui/SearchBar';
import BrandButton from '../components/button/BrandButton';
import OutletContainer from '../components/layout/container/OutletContainer';
import LoginModal from '../components/modal/LoginModal';
import { useOutletContext } from 'react-router';
import { useFavorites } from '../context/FavoritesContext';
import SortDropdown from '../components/controls/dropdown/SortDropdown';

// Styled Components
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

// Helper Functions
const createPostalCodeOptions = (postalCodes) => [
  { value: '', label: 'Alle postnumre' },
  ...postalCodes.map((code) => ({
    value: code.toString(),
    label: code.toString(),
  })),
];

const updateStoresWithFavorites = (stores, isFavorite) => {
  return stores.map((store) => ({
    ...store,
    isFavorite: isFavorite(store.id),
  }));
};

function Stores() {
  // Hooks
  const navigate = useNavigate();
  const { isFavorite } = useFavorites();
  const { showToast } = useOutletContext();

  // State Management
  const [storeState, setStoreState] = useState({
    allStores: [],
    filteredStores: [],
    postalCodes: [],
    loading: true,
  });

  const [filterState, setFilterState] = useState({
    searchTerm: '',
    selectedPostalCode: '',
    selectedBrands: new Set(),
  });

  const [modalState, setModalState] = useState({
    selectedStore: null,
    showLoginModal: false,
  });

  // Memoized Values
  const postalCodeOptions = useMemo(
    () => createPostalCodeOptions(storeState.postalCodes),
    [storeState.postalCodes]
  );

  // Event Handlers
  const handleStoreClick = (store) => {
    setModalState((prev) => ({ ...prev, selectedStore: store }));
  };

  const handleLoginRequired = () => {
    setModalState((prev) => ({ ...prev, showLoginModal: true }));
  };

  const closeLoginModal = () => {
    setModalState((prev) => ({ ...prev, showLoginModal: false }));
  };

  const handleModalClose = () => {
    setModalState((prev) => ({ ...prev, selectedStore: null }));
  };

  // Filter Functions
  const filterStores = (search, postalCode, brands, stores) => {
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

    setStoreState((prev) => ({ ...prev, filteredStores: filtered }));
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setFilterState((prev) => ({ ...prev, searchTerm: term }));
    filterStores(
      term,
      filterState.selectedPostalCode,
      filterState.selectedBrands,
      storeState.allStores
    );
  };

  const handlePostalCodeChange = async (postalCode) => {
    setFilterState((prev) => ({ ...prev, selectedPostalCode: postalCode }));
    setStoreState((prev) => ({ ...prev, loading: true }));

    try {
      if (postalCode) {
        const result = await facade.getStoresByPostalCode(postalCode);
        if (result.success) {
          const storesWithFavorites = updateStoresWithFavorites(
            result.data,
            isFavorite
          );
          setStoreState((prev) => ({
            ...prev,
            filteredStores:
              filterState.selectedBrands.size > 0
                ? storesWithFavorites.filter((store) =>
                    filterState.selectedBrands.has(store.brand.displayName)
                  )
                : storesWithFavorites,
          }));
        }
      } else {
        filterStores(
          filterState.searchTerm,
          '',
          filterState.selectedBrands,
          storeState.allStores
        );
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setStoreState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleBrandClick = (brand) => {
    const newSelectedBrands = new Set(filterState.selectedBrands);
    if (filterState.selectedBrands.has(brand)) {
      newSelectedBrands.delete(brand);
    } else {
      newSelectedBrands.add(brand);
    }

    setFilterState((prev) => ({ ...prev, selectedBrands: newSelectedBrands }));
    filterStores(
      filterState.searchTerm,
      filterState.selectedPostalCode,
      newSelectedBrands,
      storeState.allStores
    );
  };

  // Data Fetching
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const result = await facade.getAllStores();

        if (result.success) {
          const storesWithFavorites = updateStoresWithFavorites(
            result.data,
            isFavorite
          );
          const uniquePostalCodes = [
            ...new Set(
              storesWithFavorites.map(
                (store) => store.address.postalCode.postalCode
              )
            ),
          ].sort();

          setStoreState((prev) => ({
            ...prev,
            allStores: storesWithFavorites,
            filteredStores: storesWithFavorites,
            postalCodes: uniquePostalCodes,
            loading: false,
          }));
        } else {
          showToast('Der opstod en fejl ved hentning af butikker', 'error');
        }
      } catch (error) {
        showToast('Der opstod en fejl ved hentning af butikker', 'error');
        setStoreState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStores();
  }, [isFavorite, showToast]);

  // Render Functions
  if (storeState.loading) {
    return <LoadingSpinner text='Henter butikker...' fullscreen={true} />;
  }

  return (
    <OutletContainer>
      <SearchSection>
        <SearchBar
          placeholder='Søg efter en butik...'
          value={filterState.searchTerm}
          onChange={handleSearch}
        />
        <SortDropdown
          options={postalCodeOptions}
          selectedOption={filterState.selectedPostalCode}
          onSelect={handlePostalCodeChange}
          buttonText='Postnummer'
          icon='MapPin'
        />
      </SearchSection>

      <BrandSection>
        {['Netto', 'Føtex', 'Bilka'].map((brand) => (
          <BrandButton
            key={brand}
            active={filterState.selectedBrands.has(brand)}
            onClick={() => handleBrandClick(brand)}
          >
            {brand}
          </BrandButton>
        ))}
      </BrandSection>

      <CardGrid>
        {storeState.filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onClick={() => handleStoreClick(store)}
            onLoginRequired={handleLoginRequired}
            showToast={showToast}
          />
        ))}
      </CardGrid>

      {modalState.selectedStore && (
        <ProductListModal
          store={modalState.selectedStore}
          onClose={handleModalClose}
        />
      )}

      {modalState.showLoginModal && (
        <LoginModal
          isOpen={modalState.showLoginModal}
          onClose={closeLoginModal}
          onLogin={() => navigate('/login')}
          message='Du skal være logget ind for at tilføje butikker til favoritter.'
        />
      )}

      <ScrollToTop />
    </OutletContainer>
  );
}

export default Stores;
