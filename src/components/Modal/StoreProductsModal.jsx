import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import Modal from './Modal';
import LoadingSpinner from '../LoadingSpinner';
import facade from '../../util/apiFacade';

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
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  padding: 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
  }
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FilterPanel = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 1rem;
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
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
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
`;

const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Discount = styled.span`
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
`;

const DateInfo = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SortDropdown = styled.div`
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

const SortItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
`;

const StoreProductsModal = ({
  isOpen,
  store,
  onClose,
  isLoggedIn,
  navigate,
}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: new Set(),
    priceRange: { min: '', max: '' },
    discountRange: { min: '', max: '' },
    stockOnly: false,
  });
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    if (isLoggedIn && store && isOpen) {
      fetchStoreProducts();
    }
  }, [store, isLoggedIn, isOpen]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filterOptions, sortOption, searchTerm]);

  const fetchStoreProducts = async () => {
    try {
      const data = await facade.fetchData(`/stores/${store.id}`);
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
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

    // Price range
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

    // Discount range
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

    // Sorting
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

  const getAllCategories = () => {
    const categories = new Set();
    products.forEach((product) => {
      product.categories.forEach((cat) => categories.add(cat.nameDa));
    });
    return Array.from(categories);
  };

  if (!isLoggedIn) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth='500px'>
        <div>
          <h2>Log ind for at se tilbud</h2>
          <p>Du skal være logget ind for at se tilbuddene i denne butik.</p>
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
          >
            Log ind
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth='1200px'
      title={store?.name}
    >
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

        <ControlButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <SlidersHorizontal size={20} />
          Filter
        </ControlButton>

        <div style={{ position: 'relative' }}>
          <ControlButton onClick={() => setIsSortOpen(!isSortOpen)}>
            <ArrowDownUp size={20} />
            Sorter
          </ControlButton>

          <SortDropdown $isOpen={isSortOpen}>
            <SortItem onClick={() => setSortOption('price-asc')}>
              Pris (laveste først)
            </SortItem>
            <SortItem onClick={() => setSortOption('price-desc')}>
              Pris (højeste først)
            </SortItem>
            <SortItem onClick={() => setSortOption('discount-desc')}>
              Største besparelse
            </SortItem>
            <SortItem onClick={() => setSortOption('expiry-asc')}>
              Udløber snart
            </SortItem>
            <SortItem onClick={() => setSortOption('stock-desc')}>
              Antal på lager
            </SortItem>
          </SortDropdown>
        </div>
      </Controls>

      {isFilterOpen && (
        <FilterPanel>
          <FilterSection>
            <FilterTitle>Kategorier</FilterTitle>
            {getAllCategories().map((category) => (
              <CheckboxLabel key={category}>
                <input
                  type='checkbox'
                  checked={filterOptions.categories.has(category)}
                  onChange={(e) => {
                    const newCategories = new Set(filterOptions.categories);
                    if (e.target.checked) {
                      newCategories.add(category);
                    } else {
                      newCategories.delete(category);
                    }
                    setFilterOptions({
                      ...filterOptions,
                      categories: newCategories,
                    });
                  }}
                />
                {category}
              </CheckboxLabel>
            ))}
          </FilterSection>

          <FilterSection>
            <FilterTitle>Prisinterval</FilterTitle>
            <RangeInputs>
              <RangeInput
                type='number'
                placeholder='Min'
                value={filterOptions.priceRange.min}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    priceRange: {
                      ...filterOptions.priceRange,
                      min: e.target.value,
                    },
                  })
                }
              />
              <span>-</span>
              <RangeInput
                type='number'
                placeholder='Max'
                value={filterOptions.priceRange.max}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    priceRange: {
                      ...filterOptions.priceRange,
                      max: e.target.value,
                    },
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
                  setFilterOptions({
                    ...filterOptions,
                    discountRange: {
                      ...filterOptions.discountRange,
                      min: e.target.value,
                    },
                  })
                }
              />
              <span>-</span>
              <RangeInput
                type='number'
                placeholder='Max %'
                value={filterOptions.discountRange.max}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    discountRange: {
                      ...filterOptions.discountRange,
                      max: e.target.value,
                    },
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
                  setFilterOptions({
                    ...filterOptions,
                    stockOnly: e.target.checked,
                  })
                }
              />
              Vis kun varer på lager
            </CheckboxLabel>
          </FilterSection>
        </FilterPanel>
      )}

      {loading ? (
        <LoadingSpinner text='Henter tilbud...' />
      ) : (
        <ProductsGrid>
          {filteredProducts.map((product) => (
            <ProductCard key={product.ean}>
              <ProductTitle>{product.productName}</ProductTitle>
              <TagsContainer>
                {product.categories.map((category) => (
                  <Tag key={category.nameDa}>{category.nameDa}</Tag>
                ))}
              </TagsContainer>
              <PriceInfo>
                <div>
                  <Price>{product.price.newPrice.toFixed(2)} kr</Price>
                  <OriginalPrice>
                    {product.price.originalPrice.toFixed(2)} kr
                  </OriginalPrice>
                </div>
                <Discount>
                  -{product.price.percentDiscount.toFixed(0)}%
                </Discount>
              </PriceInfo>
              <StockInfo>
                <span>På lager: {product.stock.quantity} stk.</span>
              </StockInfo>
              <DateInfo>
                Tilbud gælder til:{' '}
                {new Date(product.timing.endTime).toLocaleDateString()}
              </DateInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
    </Modal>
  );
};

export default StoreProductsModal;
