import { isRouteErrorResponse, useRouteError } from 'react-router';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { getErrorMessage } from '../../utils/errorMessages';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: ${({ $theme }) => $theme.colors.text};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ $theme }) => $theme.colors.text};
  margin-bottom: 2rem;
`;

export default function ErrorBoundary() {
  const error = useRouteError();
  const { theme } = useTheme();
  let outletContext;

  try {
    outletContext = useOutletContext();
  } catch {
    outletContext = { showToast: () => {} };
  }

  const { showToast } = outletContext;

  useEffect(() => {
    const message = getErrorMessage(error);
    showToast(message, 'error');
  }, [error, showToast]);

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorContainer>
        <ErrorTitle $theme={theme}>{error.status} Fejl</ErrorTitle>
        <ErrorMessage $theme={theme}>
          {error.statusText || error.data?.message || getErrorMessage(error)}
        </ErrorMessage>
      </ErrorContainer>
    );
  }

  return (
    <ErrorContainer>
      <ErrorTitle $theme={theme}>Ups!</ErrorTitle>
      <ErrorMessage $theme={theme}>{getErrorMessage(error)}</ErrorMessage>
      {process.env.NODE_ENV === 'development' && (
        <ErrorMessage $theme={theme}>
          <i>{error.message}</i>
        </ErrorMessage>
      )}
    </ErrorContainer>
  );
}
