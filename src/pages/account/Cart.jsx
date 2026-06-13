import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../../api/cartApi';
import { ordersApi } from '../../api/orders';
import {
    getOrderItemIcon,
    getOrderItemMeta,
    getOrderItemName,
    getOrderItemTypeLabel,
    isProductVariantItem,
} from '../../services/orderItemDisplayService';
import styles from './Cart.module.css';

function formatPrice(value) {
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return '—';
    return `${num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

// --- Component ---

export default function Cart() {
    const navigate = useNavigate();

    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const [deletingItemId, setDeletingItemId] = useState(null);
    const [updatingItemId, setUpdatingItemId] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartApi.getCart();
            setCartData(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al cargar el carrito.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleRemoveItem = async (cartItemId) => {
        if (!window.confirm('¿Eliminar este ítem del carrito?')) return;
        setDeletingItemId(cartItemId);
        setError(null);
        try {
            await cartApi.removeCartItem(cartItemId);
            await fetchCart();
        } catch (err) {
            console.error(err);
            setError(err.message || 'No se pudo eliminar el ítem.');
        } finally {
            setDeletingItemId(null);
        }
    };

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        setUpdatingItemId(cartItemId);
        setError(null);
        try {
            await cartApi.updateCartItemQuantity(cartItemId, { quantity: newQuantity });
            await fetchCart();
        } catch (err) {
            console.error(err);
            setError(err.message || 'No se pudo actualizar la cantidad.');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleCheckout = async () => {
        setCheckingOut(true);
        setError(null);
        try {
            const order = await ordersApi.checkout({});
            navigate(`/account/orders/${order.id}`);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al procesar el pedido.');
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) {
        return <div className={styles.centerSpinner}>Cargando carrito...</div>;
    }

    const items = cartData?.items ?? [];
    const isEmpty = items.length === 0;

    // Prefer backend total if present; otherwise sum subtotals for display
    const total = cartData?.total != null
        ? parseFloat(cartData.total)
        : items.reduce((acc, item) => acc + parseFloat(item.subtotal ?? 0), 0);

    return (
        <div>
            <h1 className={styles.title}>Mi Carrito</h1>

            {error && (
                <div className={styles.errorBox}>{error}</div>
            )}

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
                        {items.map((item) => {
                            const itemMeta = getOrderItemMeta(item);
                            const canUpdateQuantity = isProductVariantItem(item);

                            return (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemIcon}>
                                        {getOrderItemIcon(item)}
                                    </div>

                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemName}>{getOrderItemName(item)}</div>
                                        <div className={styles.itemMeta}>{getOrderItemTypeLabel(item)}</div>
                                        {itemMeta && (
                                            <div className={styles.itemMeta}>{itemMeta}</div>
                                        )}
                                    </div>

                                    <div className={styles.itemQuantity}>
                                        {canUpdateQuantity ? (
                                            <div className={styles.quantityControl}>
                                                <button
                                                    className={styles.btnQuantity}
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={updatingItemId === item.id || item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className={styles.quantityValue}>{item.quantity}</span>
                                                <button
                                                    className={styles.btnQuantity}
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updatingItemId === item.id}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <span>Cant: {item.quantity}</span>
                                        )}
                                    </div>

                                    <div className={styles.itemPrice}>
                                        {formatPrice(item.subtotal ?? item.unit_price)}
                                    </div>

                                    <div className={styles.itemActions}>
                                        <button
                                            className={styles.btnDanger}
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={deletingItemId === item.id}
                                            title="Eliminar del carrito"
                                        >
                                            {deletingItemId === item.id ? '...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryTitle}>Resumen del pedido</div>
                        <div className={styles.summaryRow}>
                            <span>Total estimado</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <button
                            className={styles.btnCheckout}
                            onClick={handleCheckout}
                            disabled={checkingOut}
                        >
                            {checkingOut ? 'Procesando...' : 'Finalizar Compra'}
                        </button>
                        <p className={styles.checkoutNote}>
                            Al finalizar, se creará tu pedido y recibirás confirmación.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
