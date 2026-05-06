import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { useAsync } from '../../hooks/useAsync';
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

function getItemTypeLabel(type) {
    const labels = {
        print_job: 'Impresión 3D',
        product_design: 'Diseño personalizado',
        product_variant: 'Producto de catálogo',
    };
    return labels[type] ?? type;
}

function getItemName(item) {
    if (item.type === 'print_job') {
        const fileName = item.buyable?.print_file?.original_name;
        return fileName
            ? `Impresión: ${fileName}`
            : `Trabajo de impresión #${item.buyable?.id ?? '—'}`;
    }
    if (item.type === 'product_design') {
        return item.buyable?.product?.name
            ? `Diseño: ${item.buyable.product.name}`
            : `Diseño personalizado #${item.buyable?.id ?? '—'}`;
    }
    if (item.type === 'product_variant') {
        return item.buyable?.product?.name ?? `Variante #${item.buyable?.id ?? '—'}`;
    }
    return `Ítem #${item.id}`;
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

    return (
        <div>
            <Link to="/account/orders" className={styles.backLink}>
                ← Volver a pedidos
            </Link>

            <h1 className={styles.title}>
                Pedido #{order?.reference ?? order?.id}
            </h1>

            <div className={styles.detailHeader}>
                <div className={styles.detailMeta}>
                    <span>
                        Fecha: <strong>{formatDate(order?.created_at)}</strong>
                    </span>
                    <span>
                        Estado: <strong>{order?.status ?? '—'}</strong>
                    </span>
                </div>
            </div>

            <div className={styles.detailItems}>
                {items.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        No hay ítems registrados en este pedido.
                    </p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className={styles.detailItem}>
                            <div className={styles.detailItemName}>
                                {getItemName(item)}
                            </div>
                            <div className={styles.detailItemMeta}>
                                {getItemTypeLabel(item.type)}
                            </div>
                            <div className={styles.detailItemQty}>
                                Cant: {item.quantity}
                            </div>
                            <div className={styles.detailItemPrice}>
                                {formatPrice(item.subtotal ?? item.unit_price)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.detailTotal}>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
            </div>
        </div>
    );
}
