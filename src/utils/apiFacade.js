// ============= Configuration =============
const BASE_URL = "https://discountfinder.api.albertevallentin.dk/api";

// ============= Error Handling =============
/**
 * Handles HTTP response errors and formats response data
 * @param {Response} res - Fetch API response object
 * @returns {Promise<Object>} Formatted response with success status and data/error
 */
const handleHttpErrors = async (res) => {
    if (!res.ok) {
        const errorData = await res.json();
        return {
            success: false,
            error: errorData.msg || errorData.message
        };
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        return {
            success: true,
            data
        };
    }
    return {
        success: true,
        data: {}
    };
};

// ============= Request Helpers =============
/**
 * Creates request options object for API calls
 * @param {string} method - HTTP method
 * @param {boolean} addToken - Whether to add auth token
 * @param {Object} body - Request body (optional)
 * @returns {Object} Request options for fetch
 */
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

// ============= Token Management =============
const tokenMethods = {
    /**
     * Stores JWT token in localStorage
     * @param {string} token - JWT token
     */
    setToken: (token) => localStorage.setItem('jwtToken', token),

    /**
     * Retrieves JWT token from localStorage
     * @returns {string|null} JWT token
     */
    getToken: () => localStorage.getItem('jwtToken'),

    /**
     * Decodes JWT token payload
     * @param {string} token - JWT token
     * @returns {Object|null} Decoded token payload
     */
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
            return null;
        }
    },

    /**
     * Checks if user is logged in with valid token
     * @returns {boolean} Login status
     */
    loggedIn: () => {
        const token = tokenMethods.getToken();
        if (token) {
            const decodedToken = tokenMethods.decodeToken(token);
            const currentTime = Date.now() / 1000;
            return decodedToken && decodedToken.exp > currentTime;
        }
        return false;
    },

    /**
     * Removes JWT token from localStorage
     */
    logout: () => localStorage.removeItem("jwtToken")
};

// ============= Authentication API =============
const authAPI = {
    /**
     * Handles user login
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Login result
     */
    login: async (email, password) => {
        const options = makeOptions("POST", false, { email, password });
        const response = await fetch(`${BASE_URL}/auth/login`, options);
        const result = await handleHttpErrors(response);

        if (result.success && result.data.token) {
            tokenMethods.setToken(result.data.token);
        }
        return result;
    },

    /**
     * Handles user registration
     * @param {string} name - User name
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Registration result
     */
    register: async (name, email, password) => {
        const options = makeOptions("POST", false, {
            name,
            email,
            password,
            roleType: "USER"
        });
        const response = await fetch(`${BASE_URL}/auth/register`, options);
        const result = await handleHttpErrors(response);

        if (result.success && result.data.token) {
            tokenMethods.setToken(result.data.token);
        }
        return result;
    }
};

// ============= Store API =============
const storeAPI = {
    /**
     * Fetches all stores
     * @returns {Promise<Object>} Stores data
     */
    getAllStores: async () => {
        const response = await fetch(`${BASE_URL}/stores`, makeOptions("GET", false));
        const result = await handleHttpErrors(response);
        if (result.success) {
            result.data = processProducts(result.data);
        }
        return result;
    },

    /**
     * Fetches store by ID
     * @param {string} id - Store ID
     * @returns {Promise<Object>} Store data
     */
    getStoreById: async (id) => {
        const response = await fetch(`${BASE_URL}/stores/${id}`, makeOptions("GET", false));
        const result = await handleHttpErrors(response);
        if (result.success) {
            result.data = processProducts(result.data);
        }
        return result;
    },

    /**
     * Fetches stores by postal code
     * @param {string} postalCode - Postal code
     * @returns {Promise<Object>} Stores data
     */
    getStoresByPostalCode: async (postalCode) => {
        const response = await fetch(`${BASE_URL}/stores/postal_code/${postalCode}`, makeOptions("GET", false));
        const result = await handleHttpErrors(response);
        if (result.success) {
            result.data = processProducts(result.data);
        }
        return result;
    }
};

// ============= Favorites API =============
const favoriteAPI = {
    /**
     * Adds store to favorites
     * @param {string} storeId - Store ID
     * @returns {Promise<Object>} Operation result
     */
    addFavorite: async (storeId) => {
        const options = makeOptions("POST", true);
        const response = await fetch(`${BASE_URL}/stores/${storeId}/favorite`, options);
        return handleHttpErrors(response);
    },

    /**
     * Removes store from favorites
     * @param {string} storeId - Store ID
     * @returns {Promise<Object>} Operation result
     */
    removeFavorite: async (storeId) => {
        const options = makeOptions("DELETE", true);
        const response = await fetch(`${BASE_URL}/stores/${storeId}/favorite`, options);
        const result = await handleHttpErrors(response);
        console.log('Remove favorite response:', result); // Debug
        return result;
    },

    /**
     * Fetches user's favorite stores
     * @returns {Promise<Object>} Favorites data
     */
    getFavorites: async () => {
        const response = await fetch(
            `${BASE_URL}/stores/favorites`,
            makeOptions("GET", true)
        );
        const result = await handleHttpErrors(response);
        if (result.success) {
            result.data = Array.isArray(result.data) ? result.data : [];
        }
        return result;
    }
};

// ============= General Data Fetching =============
/**
 * Generic data fetching function
 * @param {string} endpoint - API endpoint
 * @param {boolean} addToken - Whether to add auth token
 * @returns {Promise<Object>} Fetched data
 */
const fetchData = async (endpoint, addToken = true) => {
    const response = await fetch(
        `${BASE_URL}${endpoint}`,
        makeOptions("GET", addToken)
    );
    const result = await handleHttpErrors(response);
    if (result.success) {
        result.data = processProducts(result.data);
    }
    return result;
};

// ============= Data Processing =============
/**
 * Processes product data to handle special characters
 * @param {Object} data - Raw product data
 * @returns {Object} Processed data
 */
const processProducts = (data) => {
    if (data?.products) {
        data.products = data.products.map(product => ({
            ...product,
            productName: product.productName?.replace(/#/g, 'Ø')
        }));
    }
    return data;
};

// ============= Facade Export =============
const facade = {
    ...tokenMethods,
    ...authAPI,
    ...storeAPI,
    ...favoriteAPI,
    fetchData,
    processProducts,
};

export default facade;