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

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const data = await facade.fetchData('/stores', false);
      setStores(data);
      setFilteredStores(data);

      const uniquePostalCodes = [
        ...new Set(data.map((store) => store.address.postalCode.postalCode)),
      ].sort();
      setPostalCodes(uniquePostalCodes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        setFilteredStores(
          selectedBrands.size > 0
            ? data.filter((store) =>
                selectedBrands.has(store.brand.displayName)
              )
            : data
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
