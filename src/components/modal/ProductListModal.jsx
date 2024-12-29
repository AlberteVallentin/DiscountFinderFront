import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import LoadingSpinner from '../feedback/LoadingSpinner';
import facade from '../../utils/apiFacade';
import SearchBar from '../controls/SearchBar';
import EmptyState from '../feedback/EmptyState';
import { useOutletContext } from 'react-router';
import ProductCard from '../card/ProductCard';

import FilterDropdown from '../controls/dropdown/FilterDropdown';
import SortDropdown from '../controls/dropdown/SortDropdown';
import PriceFilterDropdown from '../controls/dropdown/PriceFilterDropdown';

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

const sortOptions = [
  { value: 'price-asc', label: 'Pris (laveste først)' },
  { value: 'price-desc', label: 'Pris (højeste først)' },
  { value: 'discount', label: 'Største rabat først' },
  { value: 'expiry', label: 'Udløber snarest' },
];

const ProductListModal = ({ store, onClose }) => {
  const { showToast } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortOption, setSortOption] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.size > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) => selectedCategories.has(cat.nameDa))
      );
    }

    if (priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price.newPrice >= priceRange.min &&
          product.price.newPrice <= priceRange.max
      );
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
  }, [products, searchTerm, selectedCategories, sortOption, priceRange]);

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
        </Controls>

        {loading ? (
          <LoadingSpinner text='Henter tilbud...' />
        ) : products.length === 0 ? (
          <EmptyState type='NO_PRODUCTS' />
        ) : filteredProducts.length === 0 ? (
          <EmptyState type='NO_SEARCH_RESULTS' />
        ) : (
          <ProductsGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.ean} product={product} />
            ))}
          </ProductsGrid>
        )}
      </Content>
    </Modal>
  );
};

export default ProductListModal;
