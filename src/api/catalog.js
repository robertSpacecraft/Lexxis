import { apiClient } from './apiClient';

export const catalogApi = {
    getProducts: async () => {
        const { data, meta } = await apiClient.get('/catalog/products', { withMeta: true });
        return { items: data || [], meta };
    },
    getProduct: (id) => apiClient.get(`/catalog/products/${id}`),
    getVariants: (productId) => apiClient.get(`/catalog/products/${productId}/variants`),
    getVariant: (productId, variantId) => apiClient.get(`/catalog/products/${productId}/variants/${variantId}`),
};
