// errorMessages.js

export const ErrorMessages = {
    TYPE_ERROR: 'Der opstod en uventet fejl i applikationen. Vi arbejder på at løse problemet.',
    REFERENCE_ERROR: 'Der opstod en teknisk fejl. Prøv at genindlæse siden.',
    SYNTAX_ERROR: 'Der opstod en fejl i applikationens kode. Vi er blevet notificeret.',
    ASYNC_ERROR: 'Der opstod en fejl i den asynkrone operation. Prøv igen senere.',
    API_ERROR: 'API Fejl: Den ønskede ressource blev ikke fundet',
    VALIDATION_ERROR: 'Validering fejlede: Venligst tjek dine indtastninger',
    DEFAULT: 'Der opstod en uventet fejl. Prøv venligst igen.',
};

export const getErrorMessage = (error) => {
    if (error instanceof TypeError) {
        return ErrorMessages.TYPE_ERROR;
    }
    if (error instanceof ReferenceError) {
        return ErrorMessages.REFERENCE_ERROR;
    }
    if (error instanceof SyntaxError) {
        return ErrorMessages.SYNTAX_ERROR;
    }
    if (error.status === 404) {
        return ErrorMessages.API_ERROR;
    }
    if (error.status === 400) {
        return ErrorMessages.VALIDATION_ERROR;
    }
    return error.userMessage || ErrorMessages.DEFAULT;
};