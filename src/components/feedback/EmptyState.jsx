import React from 'react';
import styled from 'styled-components';
import { PackageX, Heart, Search } from 'lucide-react';
import Button from '../button/Button';
import { useNavigate } from 'react-router';

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  gap: 1.5rem;
`;

const EmptyStateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-m);
  font-weight: var(--fw-medium);
  margin: 0;
`;

const EmptyStateMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-n);
  max-width: 400px;
  margin: 0;
`;

const StyledIcon = styled.div`
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const EMPTY_STATE_TYPES = {
  NO_PRODUCTS: {
    icon: PackageX,
    title: 'Ingen varer fundet',
    message:
      'Der er desværre ingen varer på tilbud i denne butik lige nu. Prøv igen senere.',
  },
  NO_FAVORITES: {
    icon: Heart,
    title: 'Ingen favoritbutikker',
    message:
      'Du har ikke tilføjet nogle butikker til dine favoritter endnu. Udforsk butikker og tilføj dem til dine favoritter.',
    actionText: 'Find butikker',
    actionPath: '/stores',
  },
  NO_SEARCH_RESULTS: {
    icon: Search,
    title: 'Ingen resultater fundet',
    message:
      'Vi kunne ikke finde nogle varer der matcher din søgning. Prøv at søge med andre søgeord.',
  },
};

const EmptyState = ({ type = 'NO_PRODUCTS', customTitle, customMessage }) => {
  const navigate = useNavigate();
  const config = EMPTY_STATE_TYPES[type];
  const Icon = config.icon;

  return (
    <EmptyStateContainer>
      <StyledIcon>
        <Icon />
      </StyledIcon>
      <EmptyStateTitle>{customTitle || config.title}</EmptyStateTitle>
      <EmptyStateMessage>{customMessage || config.message}</EmptyStateMessage>
      {config.actionText && (
        <Button onClick={() => navigate(config.actionPath)}>
          {config.actionText}
        </Button>
      )}
    </EmptyStateContainer>
  );
};

export default EmptyState;
