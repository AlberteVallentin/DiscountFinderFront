import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useOutletContext } from 'react-router';

// Component imports
import Modal from './Modal';
import LoadingSpinner from '../feedback/LoadingSpinner';
import SearchBar from '../controls/SearchBar';
import EmptyState from '../feedback/EmptyState';
import ProductCard from '../card/ProductCard';
import FilterDropdown from '../controls/dropdown/FilterDropdown';
import SortDropdown from '../controls/dropdown/SortDropdown';
import PriceFilterDropdown from '../controls/dropdown/PriceFilterDropdown';
import Switch from '../controls/switch/Switch';
import Icon from '../ui/Icon';

// Utils
import facade from '../../utils/apiFacade';

// ============= Styled Components =============
const StoreHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const StoreName = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-l);
  font-weight: var(--fw-medium);
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const ViewOptions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleText = styled.span`
  font-size: var(--fs-s);
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  width: 9rem;
  display: block;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// ============= Constants =============
const sortOptions = [
  { value: 'price-asc', label: 'Pris (laveste først)' },
  { value: 'price-desc', label: 'Pris (højeste først)' },
  { value: 'discount', label: 'Største rabat først' },
  { value: 'expiry', label: 'Udløber snarest' },
];

/**
 * Modal component for displaying and filtering store products
 * @param {Object} store - Store data including products
 * @param {Function} onClose - Handler for closing the modal
 */
const ProductListModal = ({ store, onClose }) => {
  // ============= State Management =============
  const { showToast } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortOption, setSortOption] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [showCategories, setShowCategories] = useState(true);

  // ============= Effects =============
  // Fetch products when store changes
  useEffect(() => {
    if (store?.id) {
      fetchProducts();
    }
  }, [store?.id]);

  // ============= Data Fetching =============
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

  // ============= Memoized Values =============
  // Extract unique categories from products
  const categories = useMemo(() => {
    const categorySet = new Set();
    products.forEach((product) => {
      product.categories.forEach((category) => {
        categorySet.add(category.nameDa);
      });
    });
    return Array.from(categorySet).sort();
  }, [products]);

  // Filter and sort products based on user selections
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) => selectedCategories.has(cat.nameDa))
      );
    }

    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price.newPrice >= priceRange.min &&
          product.price.newPrice <= priceRange.max
      );
    }

    // Apply sorting
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
  }, [products, searchTerm, selectedCategories, sortOption, priceRange]);

  // ============= Event Handlers =============
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // ============= Render Logic =============
  if (loading) {
    return <LoadingSpinner text='Henter tilbud...' />;
  }

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth='1200px' minHeight='90vh'>
      <Content>
        <Controls>
          <StoreHeader>
            <StoreName>{store.name}</StoreName>
          </StoreHeader>

          <SearchSection>
            <SearchBar
              placeholder='Søg efter varer...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ViewOptions>
              <ToggleContainer>
                <Icon name='Tags' size='n' />
                <Switch
                  isToggled={showCategories}
                  onToggle={() => setShowCategories(!showCategories)}
                />
              </ToggleContainer>
              <ToggleText>
                {showCategories ? 'Skjul kategorier' : 'Vis kategorier'}
              </ToggleText>
            </ViewOptions>
          </SearchSection>

          <FilterSection>
            <FilterDropdown
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
            <PriceFilterDropdown
              currentRange={priceRange}
              onApply={setPriceRange}
            />
            <SortDropdown
              options={sortOptions}
              selectedOption={sortOption}
              onSelect={setSortOption}
              align='right'
            />
          </FilterSection>
        </Controls>

        {products.length === 0 ? (
          <EmptyState type='NO_PRODUCTS' />
        ) : filteredProducts.length === 0 ? (
          <EmptyState type='NO_SEARCH_RESULTS' />
        ) : (
          <ProductsGrid>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.ean}
                product={product}
                showCategories={showCategories}
              />
            ))}
          </ProductsGrid>
        )}
      </Content>
    </Modal>
  );
};

export default ProductListModal;
