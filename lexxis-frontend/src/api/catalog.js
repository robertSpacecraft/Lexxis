import { apiClient } from './apiClient';

export const catalogApi = {
    getProducts: () => apiClient.get('/catalog/products'),
    getProduct: (id) => apiClient.get(`/catalog/products/${id}`),
    getVariants: (productId) => apiClient.get(`/catalog/products/${productId}/variants`),
    getVariant: (productId, variantId) => apiClient.get(`/catalog/products/${productId}/variants/${variantId}`),
};
