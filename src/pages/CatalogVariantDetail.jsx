import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import Navbar from '../components/Navbar';
import styles from './CatalogVariantDetail.module.css';

export default function CatalogVariantDetail() {
    const { productId, variantId } = useParams();
    const [variant, setVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVariant = async () => {
            try {
                const variantData = await catalogApi.getVariant(productId, variantId);
                setVariant(variantData);
            } catch (err) {
                console.error(err);
                setError(err.message || 'No se pudo cargar la variante.');
            } finally {
                setLoading(false);
            }
        };
        fetchVariant();
    }, [productId, variantId]);

    if (loading) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p>Cargando variante...</p>
            </div>
        </>
    );

    if (error || !variant) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p className={styles.errorText}>{error || 'Variante no encontrada'}</p>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Link to={`/catalog/products/${productId}/variants`} className={styles.backLink}>
                    <span>&larr;</span> Volver a variantes
                </Link>

                <div className={styles.card}>
                    <h1 className={styles.title}>
                        SKU: {variant.sku || 'Sin SKU'}
                    </h1>

                    <div className={styles.specsList}>
                        {variant.size_eu && (
                            <div className={styles.specRow}>
                                <span className={styles.specKey}>Talla (EU)</span>
                                <span className={styles.specValue}>{variant.size_eu}</span>
                            </div>
                        )}
                        {variant.color_name && (
                            <div className={styles.specRow}>
                                <span className={styles.specKey}>Color</span>
                                <span className={styles.specValue}>{variant.color_name}</span>
                            </div>
                        )}
                        {variant.material_id && (
                            <div className={styles.specRow}>
                                <span className={styles.specKey}>ID Material</span>
                                <span className={styles.specValue}>{variant.material_id}</span>
                            </div>
                        )}
                        
                        {variant.price && (
                            <div className={styles.priceRow}>
                                <span className={styles.priceLabel}>Precio</span>
                                <span className={styles.priceValue}>{variant.price} €</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
