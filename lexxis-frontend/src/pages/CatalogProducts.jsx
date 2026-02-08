import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import Navbar from '../components/Navbar';

export default function CatalogProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await catalogApi.getProducts();
                // Adjust based on actual API response structure (e.g., data.data or just data)
                setProducts(Array.isArray(data) ? data : data.data || []);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

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
                <h1 className="page-title">Catálogo de Productos</h1>

                {products.length === 0 ? (
                    <p className="text-muted">No hay productos disponibles.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {products.map(product => (
                            <Link key={product.id} to={`/catalog/products/${product.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ marginBottom: '1rem', flexGrow: 1 }}>
                                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h2>
                                    {product.slug && <p className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>{product.slug}</p>}
                                    {product.hasOwnProperty('is_active') && (
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: product.is_active ? '#dcfce7' : '#fee2e2',
                                            color: product.is_active ? '#166534' : '#991b1b'
                                        }}>
                                            {product.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    )}
                                </div>
                                <div className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
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
