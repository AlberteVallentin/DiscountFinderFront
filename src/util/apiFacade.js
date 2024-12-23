const URL = "https://discountfinder.api.albertevallentin.dk/api";

function apiFacade() {
    const logResponseDetails = async (res) => {
        console.group('Response Details');
        console.log('Status:', res.status);
        console.log('Status Text:', res.statusText);
        console.log('Headers:', Object.fromEntries([...res.headers]));
        console.log('Type:', res.type);
        try {
            const clone = res.clone();
            const text = await clone.text();
            console.log('Body:', text);
        } catch (e) {
            console.log('Could not log body:', e);
        }
        console.groupEnd();
    };

    const processProducts = (data) => {
        try {
            if (data?.products) {
                data.products = data.products.map(product => ({
                    ...product,
                    productName: product.productName ? product.productName.replace(/#/g, 'Ø') : product.productName
                }));
            }
            return data;
        } catch (error) {
            console.error("Error processing products:", error);
            return data;
        }
    };

    const setToken = (token) => {
        localStorage.setItem('jwtToken', token);
    };

    const getToken = () => {
        return localStorage.getItem('jwtToken');
    };

    const decodeToken = (token) => {
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
    };

    const loggedIn = () => {
        const token = getToken();
        if (token) {
            const decodedToken = decodeToken(token);
            const currentTime = Date.now() / 1000;
            return decodedToken && decodedToken.exp > currentTime;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
    };

    const getUserRoles = () => {
        const token = getToken();
        if (token != null) {
            try {
                const payloadBase64 = getToken().split('.')[1];
                const decodedClaims = JSON.parse(window.atob(payloadBase64));
                const role = decodedClaims.role;
                return role;
            } catch (error) {
                console.error("Error decoding token:", error);
                return "";
            }
        } else return "";
    };

    const hasUserAccess = (neededRole, loggedIn) => {
        const role = getUserRoles();
        return loggedIn && role === neededRole;
    };

    const login = async (email, password) => {
        const options = makeOptions("POST", false, { email, password });
        try {
            const response = await fetch(URL + "/auth/login", options);
            const data = await handleHttpErrors(response);
            setToken(data.token);
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const fetchData = async (endpoint, addToken = true) => {
        const options = makeOptions("GET", addToken);
        try {
            const response = await fetch(URL + endpoint, options);
            const data = await handleHttpErrors(response);
            return data ? processProducts(data) : data;
        } catch (error) {
            console.error("Fetch error for endpoint:", endpoint, "Error details:", error);
            throw error;
        }
    };

    async function handleHttpErrors(res) {
        const contentType = res.headers.get("content-type");

        try {
            if (!res.ok) {
                await logResponseDetails(res);
                let errorData = {};

                if (contentType?.includes('application/json')) {
                    try {
                        errorData = await res.json();
                    } catch (e) {
                        errorData = { message: "Could not parse error response" };
                    }
                }

                console.error("HTTP error details:", {
                    status: res.status,
                    statusText: res.statusText,
                    errorData
                });

                throw { status: res.status, fullError: errorData };
            }

            if (contentType?.includes('application/json')) {
                return await res.json();
            }

            console.warn("Response was not JSON, contentType:", contentType);
            return {};

        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 500,
                fullError: {
                    message: "Error processing response",
                    originalError: error.message
                }
            };
        }
    }

    const addFavorite = async (storeId) => {
        const options = makeOptions("POST", true);
        try {
            const response = await fetch(`${URL}/stores/${storeId}/favorite`, options);
            await handleHttpErrors(response);
            return true;
        } catch (error) {
            console.error("Add favorite error:", error);
            throw error;
        }
    };

    const removeFavorite = async (storeId) => {
        const options = makeOptions("DELETE", true);
        try {
            const response = await fetch(`${URL}/stores/${storeId}/favorite`, options);
            await handleHttpErrors(response);
            return true;
        } catch (error) {
            console.error("Remove favorite error:", error);
            throw error;
        }
    };

    const getFavorites = async () => {
        try {
            const data = await fetchData('/stores/favorites', true);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Get favorites error:", error);
            if (error.status === 404) {
                return [];
            }
            throw error;
        }
    };

    const makeOptions = (method, addToken, body) => {
        const opts = {
            method: method,
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            }
        };
        if (addToken && loggedIn()) {
            opts.headers["Authorization"] = `Bearer ${getToken()}`;
        }
        if (body) {
            opts.body = JSON.stringify(body);
        }
        return opts;
    };

    return {
        makeOptions,
        setToken,
        getToken,
        loggedIn,
        login,
        logout,
        fetchData,
        hasUserAccess,
        getUserRoles,
        decodeToken,
        processProducts,
        addFavorite,
        removeFavorite,
        getFavorites,
    };
}

const facade = apiFacade();
export default facade;