// ErrorBoundary.jsx
import { isRouteErrorResponse, useRouteError } from 'react-router';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router';

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

const getUserFriendlyMessage = (error) => {
  if (error instanceof TypeError) {
    return 'Der opstod en uventet fejl i applikationen. Vi arbejder på at løse problemet.';
  }
  if (error instanceof ReferenceError) {
    return 'Der opstod en teknisk fejl. Prøv at genindlæse siden.';
  }
  if (error instanceof SyntaxError) {
    return 'Der opstod en fejl i applikationens kode. Vi er blevet notificeret om problemet.';
  }
  return 'Der opstod en uventet fejl. Prøv venligst igen.';
};

export default function ErrorBoundary() {
  const error = useRouteError();
  const { theme } = useTheme();
  let outletContext;

  try {
    outletContext = useOutletContext();
  } catch {
    // Hvis vi ikke kan få fat i context, betyder det at vi er på root niveau
    outletContext = { showToast: () => {} };
  }

  const { showToast } = outletContext;

  useEffect(() => {
    const message = getUserFriendlyMessage(error);
    showToast(message, 'error');
  }, [error, showToast]);

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorContainer>
        <ErrorTitle $theme={theme}>{error.status} Fejl</ErrorTitle>
        <ErrorMessage $theme={theme}>
          {error.statusText || error.data?.message || 'Der opstod en fejl'}
        </ErrorMessage>
      </ErrorContainer>
    );
  }

  return (
    <ErrorContainer>
      <ErrorTitle $theme={theme}>Ups!</ErrorTitle>
      <ErrorMessage $theme={theme}>
        Der opstod en uventet fejl. Vi beklager ulejligheden.
      </ErrorMessage>
      {process.env.NODE_ENV === 'development' && (
        <ErrorMessage $theme={theme}>
          <i>{error.message}</i>
        </ErrorMessage>
      )}
    </ErrorContainer>
  );
}
