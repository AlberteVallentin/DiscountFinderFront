import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import facade from '../../util/apiFacade';
import Toast from '../Toast';

const FavoriteIcon = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    fill: ${({ $isFavorite }) => ($isFavorite ? '#dc2626' : 'none')};
    stroke: ${({ $isFavorite }) => ($isFavorite ? '#dc2626' : 'currentColor')};
    stroke-width: 2;
    width: 24px;
    height: 24px;
  }
`;

const FavoriteButton = ({
  storeId,
  initialFavorite,
  onLoginRequired,
  onToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    if (!isUpdating) {
      setIsFavorite(initialFavorite);
    }
  }, [initialFavorite]);

  const handleClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    setIsUpdating(true);
    const newState = !isFavorite;

    try {
      if (newState) {
        await facade.addFavorite(storeId);
        setToast({
          visible: true,
          message: 'Butik tilføjet til favoritter',
          type: 'success',
        });
      } else {
        await facade.removeFavorite(storeId);
        setToast({
          visible: true,
          message: 'Butik fjernet fra favoritter',
          type: 'success',
        });
      }

      setIsFavorite(newState);
      if (onToggle) {
        onToggle(newState);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setToast({
        visible: true,
        message: 'Der skete en fejl. Prøv igen senere.',
        type: 'error',
      });
      setIsFavorite(!newState);
    } finally {
      setIsUpdating(false);
    }
  };

  const showAsFavorite = isFavorite && isAuthenticated;

  return (
    <>
      <FavoriteIcon
        onClick={handleClick}
        $isFavorite={showAsFavorite}
        aria-label={
          showAsFavorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'
        }
        disabled={isUpdating}
      >
        <Heart />
      </FavoriteIcon>
      {toast.visible && (
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </>
  );
};

export default FavoriteButton;
