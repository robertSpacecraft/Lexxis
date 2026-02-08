import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import Navbar from '../components/Navbar';

export default function CatalogProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await catalogApi.getProduct(productId);
                setProduct(data.data || data); // Handle wrapped or unwrapped response
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el producto.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return (
        <>
            <Navbar />
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        </>
    );

    if (error || !product) return (
        <>
            <Navbar />
            <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>
                {error || 'Producto no encontrado'}
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="container">
                <Link to="/catalog" className="text-muted text-sm" style={{ marginBottom: '1rem', display: 'inline-block' }}>&larr; Volver al catálogo</Link>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ padding: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>{product.name}</h1>

                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                            {/* Render defensivo de campos disponibles */}
                            {Object.entries(product).map(([key, value]) => {
                                if (['id', 'name', 'created_at', 'updated_at'].includes(key)) return null; // Skip common fields or display differently
                                if (typeof value === 'object') return null; // Skip nested objects for now

                                return (
                                    <div key={key} style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600, width: '150px', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</span>
                                        <span className="text-muted">{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to={`/catalog/products/${product.id}/variants`} className="btn btn-primary">
                                Ver Variantes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
