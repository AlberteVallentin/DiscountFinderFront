import { isRouteErrorResponse } from 'react-router';

export const ErrorType = {
    API: 'API_ERROR',
    AUTH: 'AUTH_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    ROUTE: 'ROUTE_ERROR',
    FATAL: 'FATAL_ERROR'
};

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

const getErrorType = (error) => {
    if (isRouteErrorResponse(error)) return ErrorType.ROUTE;
    if (error.status === 401 || error.status === 403) return ErrorType.AUTH;
    if (error.status === 400) return ErrorType.VALIDATION;
    if (error.status >= 500) return ErrorType.FATAL;
    return ErrorType.API;
};

const getUserMessage = (error, type) => {
    if (error.userMessage) return error.userMessage;
    const messages = errorMessages[type];
    return messages[error.status] || messages.default;
};

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

export const useErrorHandler = (showToast) => {
    return async (promise) => {
        try {
            return await promise;
        } catch (error) {
            handleError(error, showToast);
            throw error;
        }
    };
};