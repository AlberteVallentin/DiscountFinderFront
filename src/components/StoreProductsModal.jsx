import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Search, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import facade from '../util/apiFacade';

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
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
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
  font-size: 1.5rem;
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
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  padding: 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
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
  font-size: 0.9rem;
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

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.background};
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

const LoginPrompt = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
`;

const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.2s;

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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn && store) {
      fetchStoreProducts();
    }
  }, [store, isLoggedIn]);

  const fetchStoreProducts = async () => {
    try {
      const data = await facade.fetchData(`/stores/${store.id}`);
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
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
            <LoginButton onClick={handleLogin}>Log ind</LoginButton>
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
            <Button>
              <SlidersHorizontal size={20} />
              Filter
            </Button>
            <Button>
              <ArrowDownUp size={20} />
              Sorter
            </Button>
          </Controls>
        </Header>

        <ProductsGrid>
          {products.map((product) => (
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
      </ModalContent>
    </ModalOverlay>
  );
}
