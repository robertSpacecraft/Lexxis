import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import { getImageUrl } from '../utils/imageMapper';
import Navbar from '../components/Navbar';
import styles from './CatalogProducts.module.css';

export default function CatalogProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { items } = await catalogApi.getProducts();
                setProducts(items);
            } catch (err) {
                console.error(err);
                setError(err.message || 'No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p>Cargando catálogo...</p>
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
                <h1 className={styles.title}>Catálogo de Productos</h1>

                {products.length === 0 ? (
                    <p className={styles.emptyText}>No hay productos disponibles.</p>
                ) : (
                    <div className={styles.grid}>
                        {products.map(product => (
                            <Link key={product.id} to={`/catalog/products/${product.id}`} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    {product.main_image ? (
                                        <img 
                                            src={getImageUrl(product.main_image)} 
                                            alt={product.name} 
                                            className={styles.productImage} 
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <span>Sin imagen</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.productName}>{product.name}</h2>
                                    {product.slug && <p className={styles.productSlug}>{product.slug}</p>}
                                    {product.hasOwnProperty('is_active') && (
                                        <span className={product.is_active ? styles.badgeActive : styles.badgeInactive}>
                                            {product.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.actionBtn}>
                                    Ver Detalles
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
