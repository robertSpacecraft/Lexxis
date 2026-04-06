import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import { cartApi } from '../api/cartApi';
import ImageGallery from '../components/ImageGallery';
import Navbar from '../components/Navbar';
import styles from './CatalogVariantDetail.module.css';

export default function CatalogVariantDetail() {
    const { productId, variantId } = useParams();
    const navigate = useNavigate();
    const [variant, setVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [cartError, setCartError] = useState(null);

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

    const handleAddToCart = async () => {
        setAdding(true);
        setCartError(null);
        try {
            await cartApi.addProductVariant(variantId, 1);
            setAddedToCart(true);
            // Notify other components (Navbar) to refresh cart count
            window.dispatchEvent(new CustomEvent('lexxis-cart-updated'));
        } catch (err) {
            console.error(err);
            setCartError(err.message || 'No se pudo añadir al carrito.');
        } finally {
            setAdding(false);
        }
    };

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

                <div className={styles.variantLayout}>
                    <div className={styles.mediaColumn}>
                        <ImageGallery 
                            mainImage={variant.main_image} 
                            images={variant.images} 
                            fallbackAlt={`Variante ${variant.sku}`}
                        />
                    </div>

                    <div className={styles.infoColumn}>
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

                            <div className={styles.cartActions}>
                                {cartError && (
                                    <p className={styles.cartError}>{cartError}</p>
                                )}
                                {addedToCart ? (
                                    <div className={styles.cartSuccess}>
                                        <span>✅ Añadido al carrito</span>
                                        <button
                                            className={styles.btnSecondary}
                                            onClick={() => navigate('/account/cart')}
                                        >
                                            Ir al carrito
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className={styles.btnPrimary}
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                    >
                                        {adding ? 'Añadiendo...' : 'Añadir al carrito'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
