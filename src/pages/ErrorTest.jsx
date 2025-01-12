import React from 'react';
import { useOutletContext } from 'react-router';
import { useErrorHandler } from '../utils/errorHandler';
import Button from '../components/button/Button';
import OutletContainer from '../components/layout/container/OutletContainer';
import styled from 'styled-components';
import { ErrorMessages, getErrorMessage } from '../utils/errorMessages';

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
      throw error;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const testApiError = async () => {
    try {
      const error = new Error('HTTP 404');
      error.status = 404;
      await handleError(Promise.reject(error));
    } catch (error) {
      console.log('API error caught:', error);
    }
  };

  const testValidationError = async () => {
    try {
      const error = new Error('Invalid input');
      error.status = 400;
      await handleError(Promise.reject(error));
    } catch (error) {
      console.log('Validation error caught:', error);
    }
  };

  const testRuntimeError = () => {
    try {
      const obj = undefined;
      obj.someMethod();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const testAsyncRuntimeError = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const arr = null;
      arr.push(1);
    } catch (error) {
      showToast(ErrorMessages.ASYNC_ERROR, 'error');
      throw error;
    }
  };

  const testSyntaxError = () => {
    try {
      eval('this is not valid javascript');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const testReferenceError = () => {
    try {
      nonExistentVariable + 1;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
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
