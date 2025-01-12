import React from 'react';
import { useOutletContext } from 'react-router';
import { useErrorHandler } from '../utils/errorHandler';
import Button from '../components/button/Button';
import OutletContainer from '../components/layout/container/OutletContainer';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ErrorTest = () => {
  const { showToast } = useOutletContext();
  const handleError = useErrorHandler(showToast);

  const testSimpleError = async () => {
    try {
      const error = new Error('Teknisk fejl');
      error.userMessage = 'Dette er en brugervenlig fejlbesked';
      throw error;
    } catch (error) {
      showToast(error.userMessage || error.message, 'error');
    }
  };

  const testApiError = async () => {
    try {
      const error = new Error('HTTP 404');
      error.status = 404;
      error.userMessage = 'API Fejl: Den ønskede ressource blev ikke fundet';
      await handleError(Promise.reject(error));
    } catch (error) {
      console.log('API error caught:', error);
    }
  };

  const testValidationError = async () => {
    try {
      const error = new Error('Invalid input');
      error.status = 400;
      error.userMessage =
        'Validering fejlede: Venligst tjek dine indtastninger';
      await handleError(Promise.reject(error));
    } catch (error) {
      console.log('Validation error caught:', error);
    }
  };

  const testRuntimeError = () => {
    try {
      // Skaber en bevidst runtime fejl
      const obj = undefined;
      obj.someMethod(); // Dette vil kaste en TypeError
    } catch (error) {
      showToast(
        'Der opstod en fejl ved udførsel af operationen. Vi beklager ulejligheden.',
        'error'
      );
      throw error; // Kast fejlen videre så ErrorBoundary kan håndtere den
    }
  };

  const testAsyncRuntimeError = async () => {
    try {
      // Test af asynkron runtime fejl
      await new Promise((resolve) => setTimeout(resolve, 100));
      const arr = null;
      arr.push(1); // Dette vil kaste en TypeError
    } catch (error) {
      showToast(
        'Der opstod en fejl i den asynkrone operation. Prøv igen senere.',
        'error'
      );
      throw error;
    }
  };

  const testSyntaxError = () => {
    try {
      // Skaber en syntax error ved eval
      eval('this is not valid javascript');
    } catch (error) {
      showToast(
        'Der opstod en fejl i applikationens kode. Vi er blevet notificeret.',
        'error'
      );
      throw error;
    }
  };

  const testReferenceError = () => {
    try {
      // Reference til en ikke-eksisterende variabel
      nonExistentVariable + 1; // Dette vil kaste en ReferenceError
    } catch (error) {
      showToast(
        'Der opstod en teknisk fejl. Prøv at genindlæse siden.',
        'error'
      );
      throw error;
    }
  };

  return (
    <OutletContainer>
      <h1>Test Error Handler</h1>
      <ButtonContainer>
        <Button onClick={testSimpleError}>Test Simple Error</Button>
        <Button onClick={testApiError}>Test API Error</Button>
        <Button onClick={testValidationError}>Test Validation Error</Button>
        <Button onClick={testRuntimeError}>Test Runtime Error</Button>
        <Button onClick={testAsyncRuntimeError}>
          Test Async Runtime Error
        </Button>
        <Button onClick={testSyntaxError}>Test Syntax Error</Button>
        <Button onClick={testReferenceError}>Test Reference Error</Button>
      </ButtonContainer>
    </OutletContainer>
  );
};

export default ErrorTest;
