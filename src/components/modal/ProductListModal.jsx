import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import LoadingSpinner from '../LoadingSpinner';
import facade from '../../utils/apiFacade';
import SearchBar from '../ui/SearchBar';
import EmptyState from '../EmptyState';
import { useOutletContext } from 'react-router';
import FilterDropdown from '../dropdown/FilterDropDown';
import SortDropdown from '../dropdown/SortDropdown';
import { borderRadius } from '../../styles/Theme';

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

const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${borderRadius.rounded};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductTitle = styled.h3`
  font-size: var(--fs-n);
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryTag = styled.span`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.round};
  font-size: var(--fs-s);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.div`
  font-size: var(--fs-m);
  font-weight: var(--fw-semi-bold);
  color: ${({ theme }) => theme.colors.text};
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.border};
  font-size: var(--fs-s);
  margin-left: 0.5rem;
`;

const Discount = styled.span`
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.round};
  font-size: var(--fs-s);
`;

const StockInfo = styled.div`
  font-size: var(--fs-s);
  color: ${({ theme }) => theme.colors.text};
`;

const DateInfo = styled.div`
  font-size: var(--fs-s);
  color: ${({ theme }) => theme.colors.text};
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
  }, [products, searchTerm, selectedCategories, sortOption]);

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
