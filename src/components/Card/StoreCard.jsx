import styled from 'styled-components';
import BaseCard from './BaseCard';
import { borders } from '../../styles/Theme';

const StoreName = styled.h3`
  font-size: var(--fs-m);
  font-weight: var(--fw-medium);
  padding-bottom: 0.75rem;
  border-bottom: ${({ theme }) => `${borders.thin} ${theme.colors.line}`};
`;

const StoreAddress = styled.div`
  display: flex;
  flex-direction: column;
  font-size: var(--fs-n);
`;

const StoreCard = ({ store, onClick }) => (
  <BaseCard onClick={onClick} $clickable={!!onClick}>
    <StoreName>{store.name}</StoreName>
    <StoreAddress>
      <div>{store.address.addressLine},</div>
      <div>
        {store.address.postalCode.postalCode} {store.address.postalCode.city}
      </div>
    </StoreAddress>
  </BaseCard>
);

export default StoreCard;
