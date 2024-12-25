import React, { useState } from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

const FavoriteButton = ({ storeId, onLoginRequired, showToast, onToggle }) => {
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const favorite = isFavorite(storeId);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await toggleFavorite(storeId);
      if (result.success) {
        showToast(result.message, 'success');
        if (onToggle) {
          onToggle(storeId); // Kalder parent komponentens onToggle for at opdatere UI
        }
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <FavoriteIcon
      onClick={handleClick}
      $isFavorite={favorite}
      aria-label={favorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
      disabled={isUpdating}
    >
      <Heart />
    </FavoriteIcon>
  );
};

export default FavoriteButton;
