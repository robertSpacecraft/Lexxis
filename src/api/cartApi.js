import { apiClient } from './apiClient';

export const cartApi = {
    getCart: () => apiClient.get('/cart'),
    addProductVariant: (variantId) => apiClient.post(`/cart/product-variants/${variantId}`),
    addProductDesign: (designId) => apiClient.post(`/cart/product-designs/${designId}`),
    addPrintJob: (jobId) => apiClient.post(`/cart/print-jobs/${jobId}`),
};
