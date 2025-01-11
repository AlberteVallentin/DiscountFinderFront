import React from 'react';
import { useOutletContext } from 'react-router';
import { useErrorHandler } from '../utils/errorHandler';
import Button from '../components/button/Button';
import OutletContainer from '../components/layout/container/OutletContainer';

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

  return (
    <OutletContainer>
      <h1>Test Error Handler</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Button onClick={testSimpleError}>Test Simple Error</Button>
        <Button onClick={testApiError}>Test API Error</Button>
        <Button onClick={testValidationError}>Test Validation Error</Button>
      </div>
    </OutletContainer>
  );
};

export default ErrorTest;
