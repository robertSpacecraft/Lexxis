import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import Navbar from '../components/Navbar';

export default function CatalogVariants() {
    const { productId } = useParams();
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const { data } = await catalogApi.getVariants(productId);
                setVariants(Array.isArray(data) ? data : data.data || []);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las variantes.');
            } finally {
                setLoading(false);
            }
        };
        fetchVariants();
    }, [productId]);

    if (loading) return (
        <>
            <Navbar />
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        </>
    );

    if (error) return (
        <>
            <Navbar />
            <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>
                {error}
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="container">
                <Link to={`/catalog/products/${productId}`} className="text-muted text-sm" style={{ marginBottom: '1rem', display: 'inline-block' }}>&larr; Volver al producto</Link>
                <h1 className="page-title">Variantes del Producto</h1>

                {variants.length === 0 ? (
                    <p className="text-muted">No hay variantes disponibles para este producto.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {variants.map(variant => (
                            <Link key={variant.id} to={`/catalog/products/${productId}/variants/${variant.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>SKU: {variant.sku || 'N/A'}</h3>

                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {variant.size_eu && <p>Talla: {variant.size_eu}</p>}
                                        {variant.color_name && <p>Color: {variant.color_name}</p>}
                                        {variant.price && <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.5rem' }}>{variant.price} €</p>}
                                    </div>
                                </div>
                                <div className="btn btn-secondary" style={{ width: '100%', fontSize: '0.875rem' }}>
                                    Ver Detalle
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
