import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { borderRadius } from '../styles/Theme';
import Icon from '../components/ui/Icon';
import facade from '../util/apiFacade';
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
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostalCode, setSelectedPostalCode] = useState('');
  const [postalCodes, setPostalCodes] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedStore, setSelectedStore] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchStores = async () => {
    try {
      setLoading(true);

      // Hent butikker og favoritter parallelt hvis bruger er logget ind
      const [storesData, favoritesData] = await Promise.all([
        facade.fetchData('/stores', false),
        isAuthenticated ? facade.getFavorites() : Promise.resolve([]),
      ]);

      // Lav et Set af favorit IDs for hurtig opslag
      const favoriteIds = new Set(favoritesData.map((fav) => fav.id));

      // Opdater alle butikker med deres favorit status
      const storesWithFavorites = storesData.map((store) => ({
        ...store,
        isFavorite: favoriteIds.has(store.id),
      }));

      setStores(storesWithFavorites);
      setFilteredStores(storesWithFavorites);

      // Opdater postnumre
      const uniquePostalCodes = [
        ...new Set(
          storesData.map((store) => store.address.postalCode.postalCode)
        ),
      ].sort();
      setPostalCodes(uniquePostalCodes);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sørg for at fetchStores bliver kaldt når auth status ændrer sig
  useEffect(() => {
    fetchStores();
  }, [isAuthenticated]);

  const handleFavoriteToggle = async (storeId, isFavorite) => {
    try {
      // Opdater UI først for bedre brugeroplevelse
      const updateStores = (prevStores) =>
        prevStores.map((store) =>
          store.id === storeId ? { ...store, isFavorite } : store
        );

      setStores(updateStores);
      setFilteredStores(updateStores);

      // Hvis opdateringen fejler, vil vi få en error og kan rulle tilbage
      if (isFavorite) {
        await facade.addFavorite(storeId);
      } else {
        await facade.removeFavorite(storeId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Hvis der sker en fejl, rul tilbage til tidligere state
      const updateStores = (prevStores) =>
        prevStores.map((store) =>
          store.id === storeId ? { ...store, isFavorite: !isFavorite } : store
        );

      setStores(updateStores);
      setFilteredStores(updateStores);
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
        const data = await facade.fetchData(
          `/stores/postal_code/${postalCode}`,
          false
        );

        // Bevar favorit status fra eksisterende stores
        const storesWithFavorites = data.map((newStore) => {
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
    } catch (err) {
      setError(err.message);
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

  if (error) {
    return <div>Error: {error}</div>;
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
          />
        ))}
      </CardGrid>

      {selectedStore && (
        <ProductListModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          navigate={navigate}
        />
      )}

      <ScrollToTop />
    </OutletContainer>
  );
}

export default Stores;
