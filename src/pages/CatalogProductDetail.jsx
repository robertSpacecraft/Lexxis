import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import ImageGallery from '../components/ImageGallery';
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

                <div className={styles.productLayout}>
                    <div className={styles.mediaColumn}>
                        <ImageGallery 
                            mainImage={product.main_image} 
                            images={product.images} 
                            fallbackAlt={product.name}
                        />
                    </div>

                    <div className={styles.infoColumn}>
                        <h1 className={styles.title}>{product.name}</h1>
                        
                        {product.description && (
                            <p className={styles.description}>{product.description}</p>
                        )}

                        <div className={styles.specsList}>
                            {product.slug && (
                                <div className={styles.specRow}>
                                    <span className={styles.specKey}>Slug</span>
                                    <span className={styles.specValue}>{product.slug}</span>
                                </div>
                            )}
                            {product.category?.name && (
                                <div className={styles.specRow}>
                                    <span className={styles.specKey}>Categoría</span>
                                    <span className={styles.specValue}>{product.category.name}</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.pathContainer}>
                            <div className={styles.pathCard}>
                                <h3 className={styles.pathTitle}>Variantes de catálogo</h3>
                                <p className={styles.pathDesc}>Elige entre las combinaciones ya fabricadas.</p>
                                <Link to={`/catalog/products/${product.id}/variants`} className={styles.btnSecondary}>
                                    Ver Variantes
                                </Link>
                            </div>
                            
                            <div className={styles.pathCard}>
                                <h3 className={styles.pathTitle}>Diseño personalizado</h3>
                                <p className={styles.pathDesc}>Configura materiales, colores y tallas a medida.</p>
                                <Link to={`/catalog/products/${product.id}/design`} className={styles.btnPrimary}>
                                    Diseñar Variante
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
