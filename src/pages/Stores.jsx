import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import facade from '../utils/apiFacade';
import ScrollToTop from '../components/feedback/ScrollToTop';
import LoadingSpinner from '../components/feedback/LoadingSpinner';
import StoreCard from '../components/card/StoreCard';
import CardGrid from '../components/card/CardGrid';
import ProductListModal from '../components/modal/ProductListModal';
import SearchBar from '../components/ui/SearchBar';
import BrandButton from '../components/button/BrandButton';
import OutletContainer from '../components/layout/OutletContainer';
import LoginModal from '../components/modal/LoginModal';
import { useOutletContext } from 'react-router';
import { useFavorites } from '../context/FavoritesContext';
import SortDropdown from '../components/dropdown/SortDropdown';

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
  const { showToast } = useOutletContext();

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

  // Konverter postalCodes til det format SortDropdown forventer
  const postalCodeOptions = useMemo(
    () => [
      // Tilføj "Alle postnumre" som første mulighed
      { value: '', label: 'Alle postnumre' },
      // Tilføj resten af postnumrene
      ...postalCodes.map((code) => ({
        value: code.toString(),
        label: code.toString(),
      })),
    ],
    [postalCodes]
  );

  const updateStoresWithFavorites = (storesArray) => {
    return storesArray.map((store) => ({
      ...store,
      isFavorite: isFavorite(store.id),
    }));
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const result = await facade.getAllStores();

      if (result.success) {
        const storesWithFavorites = updateStoresWithFavorites(result.data);
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
      } else {
        showToast('Der opstod en fejl ved hentning af butikker', 'error');
      }
    } catch (error) {
      showToast('Der opstod en fejl ved hentning af butikker', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePostalCodeChange = async (postalCode) => {
    setSelectedPostalCode(postalCode);
    setLoading(true);

    try {
      if (postalCode) {
        const result = await facade.getStoresByPostalCode(postalCode);
        if (result.success) {
          const storesWithFavorites = updateStoresWithFavorites(result.data);
          setFilteredStores(
            selectedBrands.size > 0
              ? storesWithFavorites.filter((store) =>
                  selectedBrands.has(store.brand.displayName)
                )
              : storesWithFavorites
          );
        }
      } else {
        filterStores(searchTerm, '', selectedBrands);
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterStores(term, selectedPostalCode, selectedBrands);
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

  const filterStores = (search, postalCode, brands, storesArray = stores) => {
    let filtered = storesArray;

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

  const handleLoginRequired = () => {
    setShowLoginModal(true);
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

        <SortDropdown
          options={postalCodeOptions}
          selectedOption={selectedPostalCode}
          onSelect={handlePostalCodeChange}
          buttonText='Postnummer'
          icon='MapPin'
        />
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

      <ScrollToTop />
    </OutletContainer>
  );
}

export default Stores;
