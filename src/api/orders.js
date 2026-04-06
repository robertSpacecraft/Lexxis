import { apiClient } from './apiClient';

export const ordersApi = {
    getOrders: () => apiClient.get('/orders'),
    getOrder: (orderId) => apiClient.get(`/orders/${orderId}`),
    checkout: (payload = {}) => apiClient.post('/orders/checkout', payload),
};
