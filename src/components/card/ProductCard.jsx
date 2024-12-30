import styled from 'styled-components';
import BaseCard from './BaseCard';
import { borderRadius } from '../../styles/Theme';

const ProductTitle = styled.h3`
  font-size: var(--fs-n);
  font-weight: var(--fw-medium);
  color: ${({ theme }) => theme.colors.text};
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
  border-radius: ${borderRadius.round};
  font-size: var(--fs-s);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Price = styled.div`
  font-size: var(--fs-m);
  font-weight: var(--fw-semi-bold);
  color: ${({ theme }) => theme.colors.text};
`;

const Discount = styled.span`
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.round};
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.border};
  font-size: var(--fs-s);
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-s);
`;

const DateInfo = styled.div`
  font-size: var(--fs-s);
  color: ${({ theme }) => theme.colors.text};
`;

const ProductCard = ({ product, showCategories = true }) => (
  <BaseCard>
    <ProductTitle>{product.productName}</ProductTitle>
    {showCategories && (
      <TagsContainer>
        {[
          ...new Set(product.categories.map((category) => category.nameDa)),
        ].map((categoryName) => (
          <Tag key={categoryName}>{categoryName}</Tag>
        ))}
      </TagsContainer>
    )}
    <PriceInfo>
      <div>
        <Price>{product.price.newPrice.toFixed(2)} kr</Price>
        <OriginalPrice>
          {product.price.originalPrice.toFixed(2)} kr
        </OriginalPrice>
      </div>
      <Discount>-{product.price.percentDiscount.toFixed(0)}%</Discount>
    </PriceInfo>
    <StockInfo>
      <span>På lager: {product.stock.quantity} stk.</span>
    </StockInfo>
    <DateInfo>
      Tilbud gælder til: {new Date(product.timing.endTime).toLocaleDateString()}
    </DateInfo>
  </BaseCard>
);

export default ProductCard;
