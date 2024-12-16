import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import ProductsModal from './Modal/ProductsModal';
import LoginModal from './Modal/LoginModal';

import LoadingSpinner from './LoadingSpinner';
import facade from '../util/apiFacade';

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

const StockInfo = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const DateInfo = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const StoreProductsView = ({ store, onClose, isLoggedIn, navigate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (isLoggedIn && store?.id) {
      fetchProducts();
    }
  }, [store?.id, isLoggedIn]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await facade.fetchData(`/stores/${store.id}`);
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  if (!isLoggedIn) {
    return (
      <LoginModal
        isOpen={true}
        onClose={onClose}
        onLogin={() => {
          onClose();
          navigate('/login');
        }}
      />
    );
  }

  const renderProductControls = () => (
    <>
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

      <ControlButton>
        <ArrowDownUp size={20} />
        Sorter
      </ControlButton>
    </>
  );

  return (
    <ProductsModal
      isOpen={true}
      onClose={onClose}
      title={store?.name}
      isFilterOpen={isFilterOpen}
      filterContent={<div>Filter options will go here</div>}
    >
      {loading ? (
        <LoadingSpinner text='Henter tilbud...' />
      ) : (
        <>
          {renderProductControls()}
          <ProductsGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.ean}>
                <ProductTitle>{product.productName}</ProductTitle>
                <PriceInfo>
                  <Price>{product.price.newPrice.toFixed(2)} kr</Price>
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
        </>
      )}
    </ProductsModal>
  );
};

export default StoreProductsView;
