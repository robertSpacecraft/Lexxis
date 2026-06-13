import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { useAsync } from '../../hooks/useAsync';
import {
    formatAddressSummary,
    getOrderDisplayNumber,
    getOrderItemMeta,
    getOrderItemName,
    getOrderItemTypeLabel,
} from '../../services/orderItemDisplayService';
import styles from './Orders.module.css';

// --- Presentation helpers ---

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatPrice(value) {
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return '—';
    return `${num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

// --- Component ---

export default function OrderDetail() {
    const { orderId } = useParams();

    const fetchOrder = useCallback(() => ordersApi.getOrder(orderId), [orderId]);

    const { data: order, loading, error } = useAsync(fetchOrder, {
        immediate: !!orderId,
        errorMessage: 'Error al cargar el pedido.'
    });

    if (loading) {
        return <div className={styles.centerSpinner}>Cargando pedido...</div>;
    }

    if (error) {
        return (
            <div>
                <div className={styles.errorBox}>{error}</div>
                <Link to="/account/orders" className={styles.backLink}>
                    ← Volver a pedidos
                </Link>
            </div>
        );
    }

    const items = order?.items ?? [];

    // Prefer backend total; fallback to sum of subtotals
    const total = order?.total != null
        ? parseFloat(order.total)
        : items.reduce((acc, item) => acc + parseFloat(item.subtotal ?? 0), 0);
    const orderNumber = getOrderDisplayNumber(order);
    const shippingAddress = formatAddressSummary(order?.shippingAddress ?? order?.shipping_address);
    const billingAddress = formatAddressSummary(order?.billingAddress ?? order?.billing_address);

    return (
        <div>
            <Link to="/account/orders" className={styles.backLink}>
                ← Volver a pedidos
            </Link>

            <h1 className={styles.title}>
                Pedido #{orderNumber}
            </h1>

            <div className={styles.detailHeader}>
                <div className={styles.detailMeta}>
                    <span>
                        Fecha: <strong>{formatDate(order?.created_at)}</strong>
                    </span>
                    <span>
                        Estado: <strong>{order?.status ?? '—'}</strong>
                    </span>
                    {shippingAddress && (
                        <span>
                            Envío: <strong>{shippingAddress}</strong>
                        </span>
                    )}
                    {billingAddress && (
                        <span>
                            Facturación: <strong>{billingAddress}</strong>
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.detailItems}>
                {items.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        No hay ítems registrados en este pedido.
                    </p>
                ) : (
                    items.map((item) => {
                        const itemMeta = [
                            getOrderItemTypeLabel(item),
                            getOrderItemMeta(item),
                        ].filter(Boolean).join(' · ');

                        return (
                            <div key={item.id} className={styles.detailItem}>
                                <div className={styles.detailItemName}>
                                    {getOrderItemName(item)}
                                </div>
                                <div className={styles.detailItemMeta}>
                                    {itemMeta}
                                </div>
                                <div className={styles.detailItemQty}>
                                    Cant: {item.quantity}
                                </div>
                                <div className={styles.detailItemPrice}>
                                    {formatPrice(item.subtotal ?? item.unit_price)}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className={styles.detailTotal}>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
            </div>
        </div>
    );
}
