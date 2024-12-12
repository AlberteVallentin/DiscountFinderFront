import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Card from '../components/Card';
import facade from '../util/apiFacade';
import styled from 'styled-components';

const StoresContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  min-height: 80vh;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  gap: 0.5rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  flex: 1;
  max-width: 600px;
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  padding: 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-n);

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.7;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: var(--fs-n);
  box-shadow: ${({ theme }) => theme.colors.boxShadow};

  &:hover {
    opacity: 0.9;
  }
`;

const StoresGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  width: min(90%, 70rem);
  margin-inline: auto;
  padding: 1rem;
`;

const StoreCard = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1em;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StoreName = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StoreAddress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const PostalCodeSelect = styled.select`
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  font-size: var(--fs-n);
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: var(--fs-l);
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: var(--fs-m);
  color: red;
  text-align: center;
  padding: 2rem;
`;

const BrandSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const BrandButton = styled.button`
  background: ${({ active, theme }) =>
    active ? theme.colors.text : theme.colors.card};
  color: ${({ active, theme }) =>
    active ? theme.colors.card : theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.text};
  border-radius: 2rem;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-size: var(--fs-n);
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostalCode, setSelectedPostalCode] = useState('');
  const [postalCodes, setPostalCodes] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  useEffect(() => {
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

    fetchStores();
  }, []);

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

    if (brands.size > 0) {
      filtered = filtered.filter((store) =>
        brands.has(store.brand.displayName)
      );
    }

    setFilteredStores(filtered);
  };

  if (loading) return <LoadingContainer>Loading stores...</LoadingContainer>;
  if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;

  return (
    <StoresContainer>
      <SearchSection>
        <SearchBar>
          <Search size={20} />
          <SearchInput
            type='text'
            placeholder='Søg efter en butik...'
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchBar>

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

        <FilterButton>
          <Filter size={20} />
          Filter
        </FilterButton>
      </SearchSection>

      <BrandSection>
        <BrandButton
          onClick={() => handleBrandClick('Netto')}
          active={selectedBrands.has('Netto')}
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

      <StoresGrid>
        {filteredStores.map((store) => (
          <StoreCard key={store.id}>
            <StoreName>{store.name}</StoreName>
            <StoreAddress>
              <div>{store.address.addressLine}</div>
              <div>
                {store.address.postalCode.postalCode}{' '}
                {store.address.postalCode.city}
              </div>
            </StoreAddress>
          </StoreCard>
        ))}
      </StoresGrid>
    </StoresContainer>
  );
};

export default Stores;
