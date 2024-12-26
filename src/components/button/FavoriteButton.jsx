import React from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

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
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(storeId);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    try {
      const result = await toggleFavorite(storeId);
      showToast(result.message, result.success ? 'success' : 'error');
      if (result.success && onToggle) {
        onToggle(storeId);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <FavoriteIcon
      onClick={handleClick}
      $isFavorite={favorite}
      aria-label={favorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
      type='button'
    >
      <Heart />
    </FavoriteIcon>
  );
};

export default FavoriteButton;
