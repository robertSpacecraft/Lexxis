import { apiClient } from './apiClient';

export const authApi = {
    login: async (credentials) => {
        await apiClient.getCsrfCookie();
        return apiClient.post('/token-login', credentials);
    },
    register: async (data) => {
        await apiClient.getCsrfCookie();
        return apiClient.post('/register', data);
    }
};
