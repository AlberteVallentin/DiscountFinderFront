// apiFacade.js
const BASE_URL = "https://discountfinder.api.albertevallentin.dk/api";

// Hjælpefunktioner
const handleHttpErrors = async (res) => {
    if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        const error = new Error();
        error.status = res.status;
        error.fullError = errorJson;


        if (res.status === 401 && res.url.includes('/auth/login')) {
            error.userMessage = "Email eller password er forkert";
        } else {

            switch (res.status) {
                case 401:
                    error.userMessage = errorJson.message || "Du skal være logget ind for at udføre denne handling";
                    break;
                case 403:
                    error.userMessage = errorJson.message || "Du har ikke rettigheder til at udføre denne handling";
                    break;
                case 404:
                    error.userMessage = errorJson.message || "Den ønskede ressource blev ikke fundet";
                    break;
                case 422:
                    error.userMessage = errorJson.message || "Bruger findes allerede";
                    break;
                case 400:
                    error.userMessage = errorJson.message || "Ugyldig anmodning";
                    break;
                case 500:
                    error.userMessage = errorJson.message || "Der opstod en serverfejl - prøv igen senere";
                    break;
                default:
                    error.userMessage = errorJson.message || "Der skete en fejl - prøv igen senere";
            }
        }

        throw error;
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }
    return {};
};

const makeOptions = (method, addToken, body) => {
    const opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    };

    if (addToken && tokenMethods.loggedIn()) {
        opts.headers["Authorization"] = `Bearer ${tokenMethods.getToken()}`;
    }

    if (body) {
        opts.body = JSON.stringify(body);
    }

    return opts;
};

// Token håndtering
const tokenMethods = {
    setToken: (token) => localStorage.setItem('jwtToken', token),
    getToken: () => localStorage.getItem('jwtToken'),
    decodeToken: (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    },
    loggedIn: () => {
        const token = tokenMethods.getToken();
        if (token) {
            const decodedToken = tokenMethods.decodeToken(token);
            const currentTime = Date.now() / 1000;
            return decodedToken && decodedToken.exp > currentTime;
        }
        return false;
    },
    logout: () => localStorage.removeItem("jwtToken"),
    getUserRoles: () => {
        const token = tokenMethods.getToken();
        if (token) {
            try {
                const decodedToken = tokenMethods.decodeToken(token);
                return decodedToken.role;
            } catch (error) {
                console.error("Error getting user roles:", error);
                return "";
            }
        }
        return "";
    },
};

// Auth relaterede endpoints
const authAPI = {
    login: async (email, password) => {
        const options = makeOptions("POST", false, { email, password });
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, options);
            const data = await handleHttpErrors(response);
            // Kun sæt token hvis vi faktisk fik en token tilbage
            if (data.token) {
                tokenMethods.setToken(data.token);
                return data;
            } else {
                throw new Error('Invalid login response');
            }
        } catch (error) {
            error.userMessage = error.userMessage || "Login fejlede - tjek email og password";
            throw error;
        }
    },

    register: async (name, email, password) => {
        const options = makeOptions("POST", false, {
            name,
            email,
            password,
            roleType: "USER"
        });
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, options);
            const data = await handleHttpErrors(response);
            if (data.token) {
                tokenMethods.setToken(data.token);
                return data;
            } else {
                throw new Error('Invalid registration response');
            }
        } catch (error) {
            if (error.status === 403) {
                error.userMessage = "Denne email er allerede registreret";
            } else {
                error.userMessage = error.userMessage || "Registrering fejlede - prøv igen";
            }
            throw error;
        }
    }
};

// Store relaterede endpoints
const storeAPI = {
    getAllStores: async () => {
        try {
            return await fetchData('/stores', false);
        } catch (error) {
            error.userMessage = error.userMessage || "Kunne ikke hente butikker";
            throw error;
        }
    },

    getStoreById: async (id) => {
        try {
            return await fetchData(`/stores/${id}`, false);
        } catch (error) {
            error.userMessage = error.userMessage || "Kunne ikke hente butik";
            throw error;
        }
    },

    getStoresByPostalCode: async (postalCode) => {
        try {
            return await fetchData(`/stores/postal_code/${postalCode}`, false);
        } catch (error) {
            error.userMessage = error.userMessage || "Kunne ikke hente butikker for dette postnummer";
            throw error;
        }
    }
};

// Favorit relaterede endpoints
const favoriteAPI = {
    addFavorite: async (storeId) => {
        const options = makeOptions("POST", true);
        try {
            const response = await fetch(`${BASE_URL}/stores/${storeId}/favorite`, options);
            await handleHttpErrors(response);
            return true;
        } catch (error) {
            error.userMessage = error.userMessage || "Kunne ikke tilføje butik til favoritter";
            throw error;
        }
    },

    removeFavorite: async (storeId) => {
        const options = makeOptions("DELETE", true);
        try {
            const response = await fetch(`${BASE_URL}/stores/${storeId}/favorite`, options);
            await handleHttpErrors(response);
            return true;
        } catch (error) {
            error.userMessage = error.userMessage || "Kunne ikke fjerne butik fra favoritter";
            throw error;
        }
    },

    getFavorites: async () => {
        try {
            const data = await fetchData('/stores/favorites', true);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            if (error.status === 404) {
                return [];
            }
            error.userMessage = error.userMessage || "Kunne ikke hente favoritter";
            throw error;
        }
    }
};

// Generel fetch metode
const fetchData = async (endpoint, addToken = true) => {
    const options = makeOptions("GET", addToken);
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await handleHttpErrors(response);
        return processProducts(data);
    } catch (error) {
        error.userMessage = error.userMessage || "Der opstod en fejl ved hentning af data";
        throw error;
    }
};

// Produkt processering
const processProducts = (data) => {
    if (data?.products) {
        data.products = data.products.map(product => ({
            ...product,
            productName: product.productName?.replace(/#/g, 'Ø')
        }));
    }
    return data;
};

// Eksporter facade med alle metoder
const facade = {
    ...tokenMethods,
    ...authAPI,
    ...storeAPI,
    ...favoriteAPI,
    fetchData,
    processProducts,
};

export default facade;