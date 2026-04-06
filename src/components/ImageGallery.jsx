import { useState, useEffect } from 'react';
import { getImageUrl, getImageAlt } from '../utils/imageMapper';
import styles from './ImageGallery.module.css';

/**
 * ImageGallery - Shows a main image and thumbnails for selection.
 */
export default function ImageGallery({ mainImage, images, fallbackAlt = 'Producto' }) {
    const [allImages, setAllImages] = useState([]);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        const gallery = [];
        const seenUrls = new Set();
        
        if (mainImage && mainImage.url) {
            gallery.push(mainImage);
            seenUrls.add(mainImage.url);
        }
        
        if (Array.isArray(images)) {
            images.forEach(img => {
                if (img && img.url && !seenUrls.has(img.url)) {
                    gallery.push(img);
                    seenUrls.add(img.url);
                }
            });
        }
        
        setAllImages(gallery);
        setActiveImage(gallery.length > 0 ? gallery[0] : null);
    }, [mainImage, images]);

    if (allImages.length === 0) {
        return (
            <div className={styles.emptyGallery}>
                <span>Sin imagen disponible</span>
            </div>
        );
    }

    const activeUrl = getImageUrl(activeImage);
    const activeAlt = getImageAlt(activeImage, fallbackAlt);

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
                <img 
                    src={activeUrl} 
                    alt={activeAlt} 
                    className={styles.mainImage} 
                />
            </div>
            
            {allImages.length > 1 && (
                <div className={styles.thumbnails}>
                    {allImages.map((img, idx) => {
                        const url = getImageUrl(img);
                        const alt = getImageAlt(img, `${fallbackAlt} ${idx + 1}`);
                        const isActive = activeImage === img;
                        
                        return (
                            <button
                                key={idx}
                                className={`${styles.thumbnailBtn} ${isActive ? styles.activeThumbnail : ''}`}
                                onClick={() => setActiveImage(img)}
                            >
                                <img src={url} alt={alt} className={styles.thumbnailImg} />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
