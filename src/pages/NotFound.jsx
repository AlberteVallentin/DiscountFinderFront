// ============= Imports =============
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

// ============= Styled Components =============
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  text-align: center;
  gap: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-xl);
  margin: 0;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-m);
  max-width: 600px;
  margin: 0;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: var(--fs-n);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

/**
 * 404 Not Found page component
 * Displays when a route doesn't match any defined routes
 */
const NotFound = () => {
  // ============= Hooks =============
  const navigate = useNavigate();

  // ============= Render =============
  return (
    <NotFoundContainer>
      <Title>404 - Siden blev ikke fundet</Title>
      <Message>
        Beklager, men siden du leder efter findes ikke. Den kan være flyttet
        eller slettet.
      </Message>
      <BackButton onClick={() => navigate('/')}>Gå til forsiden</BackButton>
    </NotFoundContainer>
  );
};

export default NotFound;
