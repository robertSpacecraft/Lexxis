import { apiClient } from './apiClient';

export const designApi = {
    getDesigns: async () => {
        const { data, meta } = await apiClient.get('/product-designs', { withMeta: true });
        return { items: data || [], meta };
    },
    getDesign: (id) => apiClient.get(`/product-designs/${id}`),
    createDesign: (payload) => apiClient.post('/product-designs', payload),
    updateDesign: (id, payload) => apiClient.patch(`/product-designs/${id}`, payload),
    deleteDesign: (id) => apiClient.delete(`/product-designs/${id}`),
};
