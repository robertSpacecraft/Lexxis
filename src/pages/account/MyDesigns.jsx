import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { designApi } from '../../api/designApi';
import { cartApi } from '../../api/cartApi';
import styles from './MyDesigns.module.css';

export default function MyDesigns() {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            const { items } = await designApi.getDesigns();
            setDesigns(items || []);
        } catch (err) {
            console.error(err);
            setError(err.message || 'No se pudieron cargar tus diseños.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este diseño?")) return;
        
        try {
            await designApi.deleteDesign(id);
            // Refresh list
            fetchDesigns();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al eliminar el diseño');
        }
    };

    const handleAddToCart = async (id) => {
        try {
            await cartApi.addProductDesign(id);
            alert("Diseño añadido al carrito correctamente");
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al añadir al carrito');
        }
    };

    if (loading) {
        return <div className={styles.centerSpinner}>Cargando tus diseños...</div>;
    }

    return (
        <div>
            <h1 className={styles.title}>Mis Diseños</h1>

            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            {designs.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Todavía no has creado ningún diseño.</p>
                    <Link to="/catalog" style={{ color: 'var(--color-primary)', marginTop: '1rem', display: 'inline-block' }}>
                        Ir al catálogo
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {designs.map(design => (
                        <div key={design.id} className={styles.card}>
                            <div className={styles.designHeader}>
                                <div className={styles.designTitle}>
                                    {design.product?.name || `Producto #${design.product_id}`}
                                </div>
                                {/* Simple status badge, mostly 'draft' for now based on backend logic */}
                                <span className={`${styles.badge} ${design.status === 'draft' ? styles.badgeDraft : ''}`}>
                                    {design.status || 'draft'}
                                </span>
                            </div>

                            <div className={styles.detailsList}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Material:</span>
                                    <span>#{design.material_id}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Color:</span>
                                    <span>{design.color_name}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Talla:</span>
                                    <span>{design.size_eu}</span>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                {design.status === 'draft' && (
                                    <>
                                        {/* Assuming an edit would mean going back to the configurator, 
                                            but since the configurator doesn't support loading an existing design yet 
                                            we just allow delete for now as requested for MVP */}
                                        <button 
                                            className={`${styles.btnAction} ${styles.btnDelete}`}
                                            onClick={() => handleDelete(design.id)}
                                        >
                                            Eliminar
                                        </button>
                                        <button 
                                            className={`${styles.btnAction} ${styles.btnAddCart}`}
                                            onClick={() => handleAddToCart(design.id)}
                                        >
                                            Al carrito
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
