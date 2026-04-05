import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '../../api/cartApi';
import styles from './Cart.module.css';

export default function Cart() {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await cartApi.getCart();
                setCartData(data);
            } catch (err) {
                console.error(err);
                if (err.status === 404) {
                    // Empty cart might return 404 in some APIs
                    setCartData({ items: [] });
                } else {
                    setError(err.message || 'Error al cargar el carrito.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    if (loading) {
        return <div className={styles.centerSpinner}>Cargando carrito...</div>;
    }

    if (error) {
        return <div><h1 className={styles.title}>Mi Carrito</h1><p style={{ color: 'red' }}>{error}</p></div>;
    }

    const items = cartData?.items || [];
    const isEmpty = items.length === 0;

    // Calculate total naively if backend doesn't provide it
    const total = items.reduce((acc, item) => acc + (parseFloat(item.price || 0) * item.quantity), 0);

    return (
        <div>
            <h1 className={styles.title}>Mi Carrito</h1>

            {isEmpty ? (
                <div className={styles.emptyState}>
                    <p>Tu carrito está vacío.</p>
                    <Link to="/catalog" style={{ color: 'var(--color-primary)', marginTop: '1rem', display: 'inline-block' }}>
                        Explorar el catálogo
                    </Link>
                </div>
            ) : (
                <div className={styles.cartLayout}>
                    <div className={styles.itemsList}>
                        {items.map((item) => (
                            <div key={`${item.buyable_type}-${item.buyable_id}`} className={styles.cartItem}>
                                {/* Assuming item structure contains product details depending if it's Design or Variant */}
                                <div className={styles.itemImage}>
                                    {/* Placeholder for image based on buyable type */}
                                    <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '2rem' }}>
                                        🛍️
                                    </span>
                                </div>
                                
                                <div className={styles.itemDetails}>
                                    <div className={styles.itemName}>
                                        {item.buyable?.product?.name || item.buyable?.name || `Product #${item.buyable_id}`}
                                    </div>
                                    <div className={styles.itemMeta}>
                                        Tipo: {item.buyable_type === 'product_variant' ? 'Variante de catálogo' : 'Diseño personalizado'}
                                    </div>
                                    {item.buyable_type === 'product_design' && item.buyable && (
                                        <div className={styles.itemMeta}>
                                            Material: {item.buyable.material_id} • Color: {item.buyable.color_name} • Talla: {item.buyable.size_eu}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.itemQuantity}>
                                    Cant: {item.quantity}
                                </div>

                                <div className={styles.itemPrice}>
                                    {item.price ? `${parseFloat(item.price).toFixed(2)}€` : 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryTitle}>Resumen</div>
                        <div className={styles.summaryRow}>
                            <span>Total</span>
                            <span>{total.toFixed(2)}€</span>
                        </div>
                        <button className={styles.btnCheckout} onClick={() => alert('Integración de pago próximamente.')}>
                            Finalizar Compra
                        </button>
                        
                        <div className={styles.limitMessage}>
                            * Nota: Para eliminar o cambiar cantidades, contacta con soporte. (Límitación actual del sistema)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
