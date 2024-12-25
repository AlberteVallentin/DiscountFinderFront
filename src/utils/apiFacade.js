const BASE_URL = "https://discountfinder.api.albertevallentin.dk/api";

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
    logout: () => localStorage.removeItem("jwtToken")
};

const authAPI = {
    login: async (email, password) => {
        const options = makeOptions("POST", false, { email, password });
        const response = await fetch(`${BASE_URL}/auth/login`, options);
        const result = await handleHttpErrors(response);

        if (result.success && result.data.token) {
            tokenMethods.setToken(result.data.token);
        }
        return result;
    },

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

const storeAPI = {
    getAllStores: async () => {
        const response = await fetch(`${BASE_URL}/stores`, makeOptions("GET", false));
        const result = await handleHttpErrors(response);
        if (result.success) {
            result.data = processProducts(result.data);
        }
        return result;
    },

    getStoreById: async (id) => {
        const response = await fetch(`${BASE_URL}/stores/${id}`, makeOptions("GET", false));
        const result = await handleHttpErrors(response);
        if (result.success) {
            result.data = processProducts(result.data);
        }
        return result;
    },

    getStoresByPostalCode: async (postalCode) => {
        const response = await fetch(`${BASE_URL}/stores/postal_code/${postalCode}`, makeOptions("GET", false));
        const result = await handleHttpErrors(response);
        if (result.success) {
            result.data = processProducts(result.data);
        }
        return result;
    }
};

const favoriteAPI = {
    addFavorite: async (storeId) => {
        const options = makeOptions("POST", true);
        const response = await fetch(`${BASE_URL}/stores/${storeId}/favorite`, options);
        return handleHttpErrors(response);
    },

    removeFavorite: async (storeId) => {
        const options = makeOptions("DELETE", true);
        const response = await fetch(`${BASE_URL}/stores/${storeId}/favorite`, options);
        return handleHttpErrors(response);
    },

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

const processProducts = (data) => {
    if (data?.products) {
        data.products = data.products.map(product => ({
            ...product,
            productName: product.productName?.replace(/#/g, 'Ø')
        }));
    }
    return data;
};

const facade = {
    ...tokenMethods,
    ...authAPI,
    ...storeAPI,
    ...favoriteAPI,
    fetchData,
    processProducts,
};

export default facade;