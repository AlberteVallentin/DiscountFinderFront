import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Search, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import facade from '../util/apiFacade';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from './Card/ProductCard';
import CardGrid from './Card/CardGrid';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};

  ${CardGrid} {
    margin-top: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StoreName = styled.h2`
  font-size: var(--fs-l);
  color: ${({ theme }) => theme.colors.text};
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  flex: 1;
  min-width: 250px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  gap: 0.5rem;
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

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: var(--fs-n);
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: none;
  border: none;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  padding: 0.5rem;
  margin-top: 0.5rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const FilterPanel = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 1rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: var(--fs-n);
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const RangeInputs = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const RangeInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  width: 100px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text};
`;

const LoginButton = styled(Button)`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  margin-top: 1rem;
  padding: 0.75rem 2rem;

  &:hover {
    opacity: 0.9;
  }
`;

export default function StoreProductsModal({
  store,
  onClose,
  isLoggedIn,
  navigate,
}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const [filterOptions, setFilterOptions] = useState({
    categories: new Set(),
    priceRange: { min: '', max: '' },
    discountRange: { min: '', max: '' },
    stockOnly: false,
  });

  useEffect(() => {
    if (isLoggedIn && store) {
      fetchStoreProducts();
    }
  }, [store, isLoggedIn]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filterOptions, sortOption, searchTerm]);

  const fetchStoreProducts = async () => {
    try {
      const data = await facade.fetchData(`/stores/${store.id}`);
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterOptions.categories.size > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) =>
          filterOptions.categories.has(cat.nameDa)
        )
      );
    }

    // Price range filter
    if (filterOptions.priceRange.min || filterOptions.priceRange.max) {
      filtered = filtered.filter((product) => {
        const price = product.price.newPrice;
        const min = filterOptions.priceRange.min
          ? parseFloat(filterOptions.priceRange.min)
          : 0;
        const max = filterOptions.priceRange.max
          ? parseFloat(filterOptions.priceRange.max)
          : Infinity;
        return price >= min && price <= max;
      });
    }

    // Discount range filter
    if (filterOptions.discountRange.min || filterOptions.discountRange.max) {
      filtered = filtered.filter((product) => {
        const discount = product.price.percentDiscount;
        const min = filterOptions.discountRange.min
          ? parseFloat(filterOptions.discountRange.min)
          : 0;
        const max = filterOptions.discountRange.max
          ? parseFloat(filterOptions.discountRange.max)
          : Infinity;
        return discount >= min && discount <= max;
      });
    }

    // Stock filter
    if (filterOptions.stockOnly) {
      filtered = filtered.filter((product) => product.stock.quantity > 0);
    }

    // Apply sorting
    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.price.newPrice - b.price.newPrice;
          case 'price-desc':
            return b.price.newPrice - a.price.newPrice;
          case 'discount-desc':
            return b.price.percentDiscount - a.price.percentDiscount;
          case 'expiry-asc':
            return new Date(a.timing.endTime) - new Date(b.timing.endTime);
          case 'stock-desc':
            return b.stock.quantity - a.stock.quantity;
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (type, value) => {
    setFilterOptions((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const getAllCategories = () => {
    const categories = new Set();
    products.forEach((product) => {
      product.categories.forEach((cat) => categories.add(cat.nameDa));
    });
    return Array.from(categories);
  };

  if (!isLoggedIn) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
          <LoginPrompt>
            <h2>Log ind for at se tilbud</h2>
            <p>Du skal være logget ind for at se tilbuddene i denne butik.</p>
            <LoginButton
              onClick={() => {
                onClose();
                navigate('/login');
              }}
            >
              Log ind
            </LoginButton>
          </LoginPrompt>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>

        <Header>
          <StoreName>{store.name}</StoreName>
          <Controls>
            <SearchBar>
              <Search size={20} />
              <SearchInput
                type='text'
                placeholder='Søg efter varer...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>

            <Button onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <SlidersHorizontal size={20} />
              Filter
            </Button>

            <Dropdown>
              <Button onClick={() => setIsSortOpen(!isSortOpen)}>
                <ArrowDownUp size={20} />
                Sorter
              </Button>
              <DropdownContent $isOpen={isSortOpen}>
                <DropdownItem onClick={() => setSortOption('price-asc')}>
                  Pris (laveste først)
                </DropdownItem>
                <DropdownItem onClick={() => setSortOption('price-desc')}>
                  Pris (højeste først)
                </DropdownItem>
                <DropdownItem onClick={() => setSortOption('discount-desc')}>
                  Største besparelse
                </DropdownItem>
                <DropdownItem onClick={() => setSortOption('expiry-asc')}>
                  Udløber snart
                </DropdownItem>
                <DropdownItem onClick={() => setSortOption('stock-desc')}>
                  Antal på lager
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </Controls>
        </Header>

        {loading ? (
          <LoadingSpinner text='Henter tilbud...' />
        ) : (
          <>
            <FilterPanel $isOpen={isFilterOpen}>
              <FilterSection>
                <FilterTitle>Kategorier</FilterTitle>
                <CheckboxContainer>
                  {getAllCategories().map((category) => (
                    <CheckboxLabel key={category}>
                      <input
                        type='checkbox'
                        checked={filterOptions.categories.has(category)}
                        onChange={(e) => {
                          const newCategories = new Set(
                            filterOptions.categories
                          );
                          if (e.target.checked) {
                            newCategories.add(category);
                          } else {
                            newCategories.delete(category);
                          }
                          handleFilterChange('categories', newCategories);
                        }}
                      />
                      {category}
                    </CheckboxLabel>
                  ))}
                </CheckboxContainer>
              </FilterSection>

              <FilterSection>
                <FilterTitle>Prisinterval</FilterTitle>
                <RangeInputs>
                  <RangeInput
                    type='number'
                    placeholder='Min'
                    value={filterOptions.priceRange.min}
                    onChange={(e) =>
                      handleFilterChange('priceRange', {
                        ...filterOptions.priceRange,
                        min: e.target.value,
                      })
                    }
                  />
                  <span>-</span>
                  <RangeInput
                    type='number'
                    placeholder='Max'
                    value={filterOptions.priceRange.max}
                    onChange={(e) =>
                      handleFilterChange('priceRange', {
                        ...filterOptions.priceRange,
                        max: e.target.value,
                      })
                    }
                  />
                </RangeInputs>
              </FilterSection>

              <FilterSection>
                <FilterTitle>Besparelse (%)</FilterTitle>
                <RangeInputs>
                  <RangeInput
                    type='number'
                    placeholder='Min %'
                    value={filterOptions.discountRange.min}
                    onChange={(e) =>
                      handleFilterChange('discountRange', {
                        ...filterOptions.discountRange,
                        min: e.target.value,
                      })
                    }
                  />
                  <span>-</span>
                  <RangeInput
                    type='number'
                    placeholder='Max %'
                    value={filterOptions.discountRange.max}
                    onChange={(e) =>
                      handleFilterChange('discountRange', {
                        ...filterOptions.discountRange,
                        max: e.target.value,
                      })
                    }
                  />
                </RangeInputs>
              </FilterSection>

              <FilterSection>
                <CheckboxLabel>
                  <input
                    type='checkbox'
                    checked={filterOptions.stockOnly}
                    onChange={(e) =>
                      handleFilterChange('stockOnly', e.target.checked)
                    }
                  />
                  Vis kun varer på lager
                </CheckboxLabel>
              </FilterSection>
            </FilterPanel>

            <CardGrid>
              {filteredProducts.map((product) => (
                <ProductCard key={product.ean} product={product} />
              ))}
            </CardGrid>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
