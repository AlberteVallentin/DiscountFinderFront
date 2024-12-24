import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import facade from '../../utils/apiFacade';
import Toast from '../Toast';
import { useToast } from '../../hooks/useToast';

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
  showToast,
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault(); // Tilføj dette for at være sikker

    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    if (isUpdating) return; // Forhindrer multiple requests

    setIsUpdating(true);
    const newState = !isFavorite;

    try {
      const result = await facade.removeFavorite(storeId);

      if (result.success) {
        setIsFavorite(newState);
        if (onToggle) onToggle(storeId, newState);
        showToast('Butik fjernet fra favoritter', 'success');
      } else {
        setIsFavorite(!newState); // Reset state
        showToast(result.error, 'error');
      }
    } catch (error) {
      setIsFavorite(!newState); // Reset state
      showToast('Der opstod en fejl', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <FavoriteIcon
      onClick={handleClick}
      $isFavorite={isFavorite}
      aria-label={isFavorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
      disabled={isUpdating}
    >
      <Heart />
    </FavoriteIcon>
  );
};

export default FavoriteButton;
