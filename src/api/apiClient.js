import { authStorage } from '../store/authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';
const API_URL = `${BASE_URL.replace(/\/$/, '')}${API_PREFIX}`;
const SANCTUM_URL = `${BASE_URL.replace(/\/$/, '')}/sanctum/csrf-cookie`;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

async function request(endpoint, { method = 'GET', body, headers = {}, responseType = 'json', withMeta = false, ...customConfig } = {}) {
    const token = authStorage.getToken();
    const xsrfToken = getCookie('XSRF-TOKEN');

    const config = {
        method,
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to recognize AJAX
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...(xsrfToken && { 'X-XSRF-TOKEN': xsrfToken }),
            ...headers,
        },
        credentials: 'include', // Important to send/receive cookies
        ...customConfig,
    };

    if (body !== undefined && body !== null) {
        if (body instanceof FormData) {
            config.body = body;
        } else {
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        }
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (response.status === 401) {
            authStorage.clear();
            throw { status: 401, message: 'No autenticado', errors: null };
        }

        // Manejo de descargas binarias o archivos
        if (responseType === 'blob') {
            if (!response.ok) {
                const errorText = await response.text();
                throw { status: response.status, message: 'Error en la descarga', errors: null, details: errorText };
            }
            return await response.blob();
        }

        // Manejo estándar de JSON (204 No Content no intenta parsear JSON)
        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => ({}));

        // Centralizamos el manejo de errores basándonos en success = false o status != 200
        if (!response.ok || data.success === false) {
            throw {
                status: response.status,
                message: data.message || 'Error en la petición',
                errors: data.errors || null
            };
        }

        const resultData = data.data !== undefined ? data.data : data;

        if (withMeta) {
            return {
                data: resultData,
                meta: data.meta || null
            };
        }

        return resultData;
    } catch (error) {
        if (error && error.status !== undefined) {
            return Promise.reject(error);
        }

        // Handle common CORS/Redirect issues (status 0)
        const isPotentialRedirect = error instanceof TypeError && error.message === 'Failed to fetch';
        const msg = isPotentialRedirect
            ? 'Error de conexión o conflicto de sesión (CORS/Redirect). Prueba a limpiar cookies.'
            : 'Error de red o conexión';

        return Promise.reject({
            status: 0,
            message: msg,
            errors: null,
            original: error
        });
    }
}

export const apiClient = {
    get: (endpoint, customConfig = {}) => request(endpoint, { ...customConfig, method: 'GET' }),
    post: (endpoint, body, customConfig = {}) => request(endpoint, { ...customConfig, method: 'POST', body }),
    put: (endpoint, body, customConfig = {}) => request(endpoint, { ...customConfig, method: 'PUT', body }),
    patch: (endpoint, body, customConfig = {}) => request(endpoint, { ...customConfig, method: 'PATCH', body }),
    delete: (endpoint, customConfig = {}) => request(endpoint, { ...customConfig, method: 'DELETE' }),
    getCsrfCookie: async () => {
        await fetch(SANCTUM_URL, { credentials: 'include' });
    }
};
