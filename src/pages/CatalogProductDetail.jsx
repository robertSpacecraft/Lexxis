import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import Navbar from '../components/Navbar';
import styles from './CatalogProductDetail.module.css';

export default function CatalogProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await catalogApi.getProduct(productId);
                setProduct(productData);
            } catch (err) {
                console.error(err);
                setError(err.message || 'No se pudo cargar el producto.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p>Cargando producto...</p>
            </div>
        </>
    );

    if (error || !product) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p className={styles.errorText}>{error || 'Producto no encontrado'}</p>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Link to="/catalog" className={styles.backLink}>
                    <span>&larr;</span> Volver al catálogo
                </Link>

                <div className={styles.card}>
                    <h1 className={styles.title}>{product.name}</h1>

                    <div className={styles.specsList}>
                        {Object.entries(product).map(([key, value]) => {
                            if (['id', 'name', 'created_at', 'updated_at'].includes(key)) return null;
                            if (typeof value === 'object') return null;

                            return (
                                <div key={key} className={styles.specRow}>
                                    <span className={styles.specKey}>{key.replace(/_/g, ' ')}</span>
                                    <span className={styles.specValue}>{String(value)}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.actions}>
                        <Link to={`/catalog/products/${product.id}/variants`} className={styles.btnPrimary}>
                            Ver Variantes
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
