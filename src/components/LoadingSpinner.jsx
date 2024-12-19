import React from 'react';
import { Loader2 } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: ${({ fullscreen }) => (fullscreen ? '100vh' : '200px')};
  gap: 1rem;
`;

const SpinnerIcon = styled(Loader2)`
  color: ${({ theme }) => theme.colors.text};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-m);
  margin: 0;
`;

const LoadingSpinner = ({
  text = 'Loading...',
  fullscreen = false,
  size = 40,
}) => {
  return (
    <LoadingContainer fullscreen={fullscreen}>
      <SpinnerIcon size={size} />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
