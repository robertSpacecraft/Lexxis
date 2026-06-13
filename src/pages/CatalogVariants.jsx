import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import { getImageUrl } from '../utils/imageMapper';
import { useAsync } from '../hooks/useAsync';
import Navbar from '../components/Navbar';
import styles from './CatalogVariants.module.css';

export default function CatalogVariants() {
    const { productId } = useParams();

    const fetchVariants = useCallback(() => catalogApi.getVariants(productId), [productId]);

    const { data, loading, error } = useAsync(fetchVariants, {
        immediate: !!productId,
        errorMessage: 'No se pudieron cargar las variantes.'
    });

    const variants = data || [];

    if (loading) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p>Cargando variantes...</p>
            </div>
        </>
    );

    if (error) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p className={styles.errorText}>{error}</p>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Link to={`/catalog/products/${productId}`} className={styles.backLink}>
                    <span>&larr;</span> Volver al producto
                </Link>
                <h1 className={styles.title}>Variantes del Producto</h1>

                {variants.length === 0 ? (
                    <p className={styles.emptyText}>No hay variantes disponibles para este producto.</p>
                ) : (
                    <div className={styles.grid}>
                        {variants.map(variant => (
                            <Link key={variant.id} to={`/catalog/products/${productId}/variants/${variant.id}`} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    {variant.main_image ? (
                                        <img
                                            src={getImageUrl(variant.main_image)}
                                            alt={`Variante ${variant.sku}`}
                                            className={styles.variantImage}
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <span>Sin imagen</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.variantSku}>SKU: {variant.sku || 'N/A'}</h3>

                                    <div>
                                        {variant.size_eu && <p className={styles.variantDetail}>Talla: {variant.size_eu}</p>}
                                        {variant.color_name && <p className={styles.variantDetail}>Color: {variant.color_name}</p>}
                                        {variant.price && <p className={styles.variantPrice}>{variant.price} €</p>}
                                    </div>
                                </div>
                                <div className={styles.actionBtn}>
                                    Ver Detalle
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
