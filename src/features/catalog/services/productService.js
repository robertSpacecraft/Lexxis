const DEFAULT_MODEL_DESCRIPTION = 'Modelo de calzado 3D disponible para explorar variantes y personalizacion.';

export function getBestSellingProducts(response, limit = 3) {
    const products = Array.isArray(response?.items) ? response.items : [];

    return products
        .filter(product => product?.is_active !== false)
        .slice(0, limit)
        .map(normalizeProductCard);
}

function normalizeProductCard(product) {
    return {
        id: product.id,
        name: product.name || 'Modelo Lexxis',
        description: product.short_description || product.description || DEFAULT_MODEL_DESCRIPTION,
        image: product.main_image || null,
        priceLabel: formatProductPrice(product.base_price),
    };
}

function formatProductPrice(price) {
    if (price === null || price === undefined || price === '') {
        return null;
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
        return null;
    }

    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(numericPrice);
}
