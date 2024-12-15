import styled from 'styled-components';
import BaseCard from './BaseCard';

const StyledCard = styled(BaseCard)`
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
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

const StoreCard = ({ store, onClick }) => (
  <StyledCard onClick={onClick}>
    <StoreName>{store.name}</StoreName>
    <StoreAddress>
      <div>{store.address.addressLine}</div>
      <div>
        {store.address.postalCode.postalCode} {store.address.postalCode.city}
      </div>
    </StoreAddress>
  </StyledCard>
);

export default StoreCard;
