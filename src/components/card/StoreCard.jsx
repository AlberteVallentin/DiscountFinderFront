import React, { useState } from 'react';
import styled from 'styled-components';
import BaseCard from './BaseCard';
import FavoriteButton from '../button/FavoriteButton';
import LoginModal from '../modal/LoginModal';
import { useNavigate } from 'react-router';
import { borders } from '../../styles/Theme';

const StoreCardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StoreName = styled.h3`
  font-size: var(--fs-m);
  font-weight: var(--fw-medium);
  padding-bottom: 0.75rem;
  padding-right: 0.5rem;
  border-bottom: ${({ theme }) => `${borders.thin} ${theme.colors.line}`};
`;

const StoreAddress = styled.div`
  display: flex;
  flex-direction: column;
  font-size: var(--fs-n);
`;

const StoreCard = ({ store, onClick, onFavoriteToggle, showToast }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleFavoriteToggle = async (storeId, newFavoriteState) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(storeId, newFavoriteState);
    }
  };

  return (
    <StoreCardWrapper>
      <BaseCard onClick={onClick} $clickable={!!onClick}>
        <FavoriteButton
          storeId={store.id}
          onLoginRequired={handleLoginRequired}
          onToggle={handleFavoriteToggle}
          showToast={showToast}
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
          message='Du skal være logget ind for at tilføje butikker til favoritter.'
        />
      )}
    </StoreCardWrapper>
  );
};

export default StoreCard;
