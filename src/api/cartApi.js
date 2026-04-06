import { apiClient } from './apiClient';

export const cartApi = {
    getCart: () => apiClient.get('/cart'),
    addProductVariant: (variantId, quantity = 1) => apiClient.post(`/cart/product-variants/${variantId}`, { quantity }),
    addProductDesign: (designId, quantity = 1) => apiClient.post(`/cart/product-designs/${designId}`, { quantity }),
    addPrintJob: (jobId, quantity = 1) => apiClient.post(`/cart/print-jobs/${jobId}`, { quantity }),
    updateCartItemQuantity: (cartItemId, payload) => apiClient.patch(`/cart/items/${cartItemId}`, payload),
    removeCartItem: (cartItemId) => apiClient.delete(`/cart/items/${cartItemId}`),
};
