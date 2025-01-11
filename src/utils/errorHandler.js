// ============= Imports =============
import { isRouteErrorResponse } from 'react-router';



// ============= Custom Hook =============
// 
/**
 * Custom hook for handling errors in async operations
 * @param {Function} showToast - Toast notification function
 * @returns {Function} Error handler function wrapper
 */
export const useErrorHandler = (showToast) => { // Modtager showToast som parameter
    return async (promise) => {
        try {
            return await promise;
        } catch (error) {
            handleError(error, showToast); // sender showToast videre til handleError
            throw error;
        }
    };
};










// ============= Constants =============
/**
 * Enum for different types of errors handled in the application
 */
export const ErrorType = {
    API: 'API_ERROR',
    AUTH: 'AUTH_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    ROUTE: 'ROUTE_ERROR',
    FATAL: 'FATAL_ERROR'
};

/**
 * Error messages mapped by error type and status code
 */
const errorMessages = {
    [ErrorType.API]: {
        default: 'Der opstod en fejl ved kommunikation med serveren',
        404: 'Den ønskede ressource blev ikke fundet',
        500: 'Der er problemer med serveren lige nu'
    },
    [ErrorType.AUTH]: {
        default: 'Der opstod en fejl med din login status',
        401: 'Du skal være logget ind for at udføre denne handling',
        403: 'Du har ikke rettigheder til at udføre denne handling'
    },
    [ErrorType.VALIDATION]: {
        default: 'Der er fejl i de indtastede data'
    },
    [ErrorType.ROUTE]: {
        default: 'Siden blev ikke fundet',
        404: 'Siden findes ikke'
    },
    [ErrorType.FATAL]: {
        default: 'Der opstod en uventet fejl'
    }
};

// ============= Helper Functions =============
/**
 * Determines the type of error based on error response
 * @param {Error} error - The error object to analyze
 * @returns {string} The determined error type
 */
const getErrorType = (error) => {
    if (isRouteErrorResponse(error)) return ErrorType.ROUTE;
    if (error.status === 401 || error.status === 403) return ErrorType.AUTH;
    if (error.status === 400) return ErrorType.VALIDATION;
    if (error.status >= 500) return ErrorType.FATAL;
    return ErrorType.API;
};

/**
 * Gets appropriate user message for the error
 * @param {Error} error - The error object
 * @param {string} type - The error type
 * @returns {string} User-friendly error message
 */
const getUserMessage = (error, type) => {
    if (error.userMessage) return error.userMessage;
    const messages = errorMessages[type];
    return messages[error.status] || messages.default;
};

// ============= Main Error Handler =============
/**
 * Main error handling function
 * @param {Error} error - The error to handle
 * @param {Function} showToast - Toast notification function
 */
export const handleError = (error, showToast) => {
    console.error('Error occurred:', error);

    const errorType = getErrorType(error);
    const userMessage = getUserMessage(error, errorType);

    if (errorType === ErrorType.FATAL) {
        throw error;
    }

    if (errorType === ErrorType.ROUTE) {
        return;
    }

    showToast(userMessage, 'error');
};

