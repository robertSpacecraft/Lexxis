import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { useAsync } from '../../hooks/useAsync';
import styles from './Orders.module.css';

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

export default function Orders() {
    const { data, loading, error } = useAsync(ordersApi.getOrders, {
        errorMessage: 'Error al cargar los pedidos.'
    });
    const orders = data || [];

    if (loading) {
        return <div className={styles.centerSpinner}>Cargando pedidos...</div>;
    }

    return (
        <div>
            <h1 className={styles.title}>Mis Pedidos</h1>

            {error && <div className={styles.errorBox}>{error}</div>}

            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No tienes pedidos realizados aún.</p>
                    <Link to="/catalog" style={{ color: 'var(--color-primary)', marginTop: '1rem', display: 'inline-block' }}>
                        Explorar el catálogo
                    </Link>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderInfo}>
                                <div className={styles.orderRef}>
                                    Pedido #{order.reference ?? order.id}
                                </div>
                                <div className={styles.orderDate}>
                                    {formatDate(order.created_at)}
                                </div>
                            </div>

                            <div className={styles.orderStatus}>
                                <span className={styles.statusBadge}>
                                    {order.status ?? '—'}
                                </span>
                            </div>

                            <div className={styles.orderTotal}>
                                {formatPrice(order.total)}
                            </div>

                            <Link
                                to={`/account/orders/${order.id}`}
                                className={styles.btnDetail}
                            >
                                Ver detalle
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
