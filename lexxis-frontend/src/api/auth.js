import { apiClient } from './apiClient';

export const authApi = {
    login: async (credentials) => {
        await apiClient.getCsrfCookie();
        return apiClient.post('/token-login', credentials);
    },
};
