import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import facade from '../../util/apiFacade';

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

  // Synkroniser med initialFavorite når den ændrer sig
  useEffect(() => {
    if (!isUpdating) {
      // Kun opdater hvis vi ikke er midt i et API kald
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
      } else {
        await facade.removeFavorite(storeId);
      }

      setIsFavorite(newState);
      if (onToggle) {
        onToggle(newState);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(!newState); // Revert ved fejl
    } finally {
      setIsUpdating(false);
    }
  };

  // Kun vis rød hvis både favorite OG authenticated
  const showAsFavorite = isFavorite && isAuthenticated;

  return (
    <FavoriteIcon
      onClick={handleClick}
      $isFavorite={showAsFavorite}
      aria-label={showAsFavorite ? 'Remove from favorites' : 'Add to favorites'}
      disabled={isUpdating}
    >
      <Heart />
    </FavoriteIcon>
  );
};

export default FavoriteButton;
