import { apiClient } from './apiClient';

export const userApi = {
    getProfile: () => apiClient.get('/me'),
    updateProfile: (payload) => apiClient.patch('/me', payload),
};
