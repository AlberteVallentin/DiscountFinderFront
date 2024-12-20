import styled from 'styled-components';
import BaseCard from './BaseCard';
import { borders } from '../../styles/Theme';
import FavoriteButton from '../button/FavoriteButton';
import { useState } from 'react';
import LoginModal from '../modal/LoginModal';
import { useNavigate } from 'react-router';

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

const StoreCardWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StoreCard = ({ store, onClick, onFavoriteToggle }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  return (
    <StoreCardWrapper>
      <BaseCard onClick={onClick} $clickable={!!onClick}>
        <FavoriteButton
          storeId={store.id}
          initialFavorite={store.isFavorite}
          onLoginRequired={handleLoginRequired}
          onToggle={(isFavorite) => onFavoriteToggle?.(store.id, isFavorite)}
        />
        <StoreName>{store.name}</StoreName>
        <StoreAddress>
          <div>{store.address.addressLine},</div>
          <div>
            {store.address.postalCode.postalCode}{' '}
            {store.address.postalCode.city}
          </div>
        </StoreAddress>
      </BaseCard>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </StoreCardWrapper>
  );
};

export default StoreCard;
