import styled from 'styled-components';
import BaseCard from './BaseCard';

const StoreCardContainer = styled(BaseCard)`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  max-width: 300px;
  align-items: center;
`;

const StoreName = styled.h2`
  font-size: var(--fs-m);
  font-weight: var(--fw-medium);
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

const StoreAddress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: var(--fs-n);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const StoreCard = ({ store, onClick }) => {
  return (
    <StoreCardContainer onClick={onClick} interactive={!!onClick}>
      <StoreName>{store.name}</StoreName>
      <StoreAddress>
        <div>{store.address.addressLine}</div>
        <div>
          {store.address.postalCode.postalCode} {store.address.postalCode.city}
        </div>
      </StoreAddress>
    </StoreCardContainer>
  );
};

export default StoreCard;
