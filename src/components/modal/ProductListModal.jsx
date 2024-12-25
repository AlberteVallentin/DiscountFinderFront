import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import Modal from './Modal';
import LoadingSpinner from '../LoadingSpinner';
import facade from '../../utils/apiFacade';
import SearchBar from '../ui/SearchBar';
import Toast from '../Toast';
import EmptyState from '../EmptyState';
import { useErrorHandler } from '../../utils/errorHandler';
import { useToast } from '../../hooks/useToast';
import { useOutletContext } from 'react-router';

const StoreHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const StoreName = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-l);
  font-weight: var(--fw-medium);
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  width: 100%;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const FilterPanel = styled.div`
  width: 100%;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const PriceInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  width: 100px;
`;

const SortDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 200px;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const SortOption = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
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

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryTag = styled.span`
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

const OldPrice = styled.span`
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

const Discount = styled.span`
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
`;

const StockInfo = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const DateInfo = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProductListModal = ({ store, onClose }) => {
  const { showToast } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: new Set(),
    priceRange: { min: '', max: '' },
  });
  const [sortOption, setSortOption] = useState('');

  //const { toast, showToast, hideToast } = useToast();
  const handleError = useErrorHandler(showToast);

  useEffect(() => {
    if (store?.id) {
      fetchProducts();
    }
  }, [store?.id]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await facade.getStoreById(store.id);

      if (result.success) {
        setProducts(result.data.products || []);
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const categorySet = new Set();
    products.forEach((product) => {
      product.categories.forEach((category) => {
        categorySet.add(category.nameDa);
      });
    });
    return Array.from(categorySet).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOptions.categories.size > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) =>
          filterOptions.categories.has(cat.nameDa)
        )
      );
    }

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

    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.price.newPrice - b.price.newPrice;
          case 'price-desc':
            return b.price.newPrice - a.price.newPrice;
          case 'discount':
            return b.price.percentDiscount - a.price.percentDiscount;
          case 'expiry':
            return new Date(a.timing.endTime) - new Date(b.timing.endTime);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, searchTerm, filterOptions, sortOption]);

  const handleCategoryToggle = (category) => {
    const newCategories = new Set(filterOptions.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setFilterOptions((prev) => ({
      ...prev,
      categories: newCategories,
    }));
  };

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth='1200px' minHeight='90vh'>
      <Content>
        <Controls>
          <StoreHeader>
            <StoreName>{store.name}</StoreName>
          </StoreHeader>
          <SearchBar
            placeholder='Søg efter varer...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ControlButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <SlidersHorizontal size={20} />
            Filter
          </ControlButton>

          <div style={{ position: 'relative' }}>
            <ControlButton onClick={() => setIsSortOpen(!isSortOpen)}>
              <ArrowDownUp size={20} />
              Sorter
            </ControlButton>

            {isSortOpen && (
              <SortDropdown>
                <SortOption
                  onClick={() => {
                    setSortOption('price-asc');
                    setIsSortOpen(false);
                  }}
                >
                  Pris (laveste først)
                </SortOption>
                <SortOption
                  onClick={() => {
                    setSortOption('price-desc');
                    setIsSortOpen(false);
                  }}
                >
                  Pris (højeste først)
                </SortOption>
                <SortOption
                  onClick={() => {
                    setSortOption('discount');
                    setIsSortOpen(false);
                  }}
                >
                  Største rabat først
                </SortOption>
                <SortOption
                  onClick={() => {
                    setSortOption('expiry');
                    setIsSortOpen(false);
                  }}
                >
                  Udløber snarest
                </SortOption>
              </SortDropdown>
            )}
          </div>
        </Controls>
        {isFilterOpen && (
          <FilterPanel>
            <FilterSection>
              <FilterTitle>Kategorier</FilterTitle>
              {categories.map((category) => (
                <CheckboxLabel key={category}>
                  <input
                    type='checkbox'
                    checked={filterOptions.categories.has(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  {category}
                </CheckboxLabel>
              ))}
            </FilterSection>

            <FilterSection>
              <FilterTitle>Prisinterval</FilterTitle>
              <PriceInputs>
                <PriceInput
                  type='number'
                  placeholder='Min'
                  value={filterOptions.priceRange.min}
                  onChange={(e) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: e.target.value },
                    }))
                  }
                />
                <span>-</span>
                <PriceInput
                  type='number'
                  placeholder='Max'
                  value={filterOptions.priceRange.max}
                  onChange={(e) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: e.target.value },
                    }))
                  }
                />
              </PriceInputs>
            </FilterSection>
          </FilterPanel>
        )}
        {loading ? (
          <LoadingSpinner text='Henter tilbud...' />
        ) : products.length === 0 ? (
          // Hvis der ikke er varer i butikken
          <EmptyState type='NO_PRODUCTS' />
        ) : filteredProducts.length === 0 ? (
          // Hvis der er varer, men alle er filtreret fra
          <EmptyState type='NO_SEARCH_RESULTS' />
        ) : (
          <ProductsGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.ean}>
                <ProductTitle>{product.productName}</ProductTitle>
                <CategoriesContainer>
                  {[
                    ...new Set(product.categories.map((cat) => cat.nameDa)),
                  ].map((categoryName) => (
                    <CategoryTag key={categoryName}>{categoryName}</CategoryTag>
                  ))}
                </CategoriesContainer>
                <PriceInfo>
                  <div>
                    <Price>{product.price.newPrice.toFixed(2)} kr</Price>
                    <OldPrice>
                      {product.price.originalPrice.toFixed(2)} kr
                    </OldPrice>
                  </div>
                  <Discount>
                    -{product.price.percentDiscount.toFixed(0)}%
                  </Discount>
                </PriceInfo>
                <StockInfo>På lager: {product.stock.quantity} stk.</StockInfo>
                <DateInfo>
                  Tilbud gælder til:{' '}
                  {new Date(product.timing.endTime).toLocaleDateString()}
                </DateInfo>
              </ProductCard>
            ))}
          </ProductsGrid>
        )}
      </Content>
    </Modal>
  );
};

export default ProductListModal;
