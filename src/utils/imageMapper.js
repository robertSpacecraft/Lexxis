/**
 * Image Mapper Utility
 * 
 * Centralizes image URL resolution following the backend contract:
 * - Use .url if available
 * - Handle null/undefined gracefully
 * - Avoid duplicates in galleries
 */

/**
 * Gets the URL from an image object or returns a placeholder/null
 * @param {Object|null} imageObj 
 * @returns {string|null}
 */
export const getImageUrl = (imageObj) => {
    if (!imageObj) return null;
    return imageObj.url || null;
};

/**
 * Gets the Alt Text from an image object
 * @param {Object|null} imageObj 
 * @param {string} fallback 
 * @returns {string}
 */
export const getImageAlt = (imageObj, fallback = 'Imagen') => {
    if (!imageObj) return fallback;
    return imageObj.alt_text || fallback;
};

/**
 * Returns a list of unique image objects for a gallery, 
 * ensuring the main image is included but not duplicated.
 * 
 * @param {Object|null} mainImage 
 * @param {Array|null} imagesList 
 * @returns {Array}
 */
export const getGalleryImages = (mainImage, imagesList) => {
    const gallery = [];
    const seenUrls = new Set();

    if (mainImage && mainImage.url) {
        gallery.push(mainImage);
        seenUrls.add(mainImage.url);
    }

    if (Array.isArray(imagesList)) {
        imagesList.forEach(img => {
            if (img && img.url && !seenUrls.has(img.url)) {
                gallery.push(img);
                seenUrls.add(img.url);
            }
        });
    }

    return gallery;
};
