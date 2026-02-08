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

async function request(endpoint, { method = 'GET', body, headers = {}, ...customConfig } = {}) {
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

    if (body) {
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
            // Optional: redirect only if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject({ message: 'Unauthorized' });
        }

        const data = await response.json().catch(() => ({})); 

        if (!response.ok) {
            return Promise.reject(data);
        }

        return { status: response.status, data };
    } catch (error) {
        return Promise.reject(error);
    }
}

export const apiClient = {
    get: (endpoint, customConfig = {}) => request(endpoint, { ...customConfig, method: 'GET' }),
    post: (endpoint, body, customConfig = {}) => request(endpoint, { ...customConfig, method: 'POST', body }),
    put: (endpoint, body, customConfig = {}) => request(endpoint, { ...customConfig, method: 'PUT', body }),
    delete: (endpoint, customConfig = {}) => request(endpoint, { ...customConfig, method: 'DELETE' }),
    getCsrfCookie: async () => {
        await fetch(SANCTUM_URL, { credentials: 'include' });
    }
};
