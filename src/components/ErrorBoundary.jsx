import { isRouteErrorResponse, useRouteError } from 'react-router';
import styled from 'styled-components';

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
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorContainer>
        <ErrorTitle>{error.status} Error</ErrorTitle>
        <ErrorMessage>{error.statusText || error.data.message}</ErrorMessage>
      </ErrorContainer>
    );
  }

  return (
    <ErrorContainer>
      <ErrorTitle>Oops!</ErrorTitle>
      <ErrorMessage>Sorry, an unexpected error has occurred.</ErrorMessage>
      <ErrorMessage>
        <i>{error.message}</i>
      </ErrorMessage>
    </ErrorContainer>
  );
}
