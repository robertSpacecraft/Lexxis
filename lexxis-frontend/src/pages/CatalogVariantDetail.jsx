import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import Navbar from '../components/Navbar';

export default function CatalogVariantDetail() {
    const { productId, variantId } = useParams();
    const [variant, setVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVariant = async () => {
            try {
                const { data } = await catalogApi.getVariant(productId, variantId);
                setVariant(data.data || data);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar la variante.');
            } finally {
                setLoading(false);
            }
        };
        fetchVariant();
    }, [productId, variantId]);

    if (loading) return (
        <>
            <Navbar />
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        </>
    );

    if (error || !variant) return (
        <>
            <Navbar />
            <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>
                {error || 'Variante no encontrada'}
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="container">
                <Link to={`/catalog/products/${productId}/variants`} className="text-muted text-sm" style={{ marginBottom: '1rem', display: 'inline-block' }}>&larr; Volver a variantes</Link>

                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ padding: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            SKU: {variant.sku || 'Sin SKU'}
                        </h1>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {variant.size_eu && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>Talla (EU)</span>
                                    <span>{variant.size_eu}</span>
                                </div>
                            )}
                            {variant.color_name && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>Color</span>
                                    <span>{variant.color_name}</span>
                                </div>
                            )}
                            {variant.material_id && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>ID Material</span>
                                    <span>{variant.material_id}</span>
                                </div>
                            )}
                            {variant.price && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>Precio</span>
                                    <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>{variant.price} €</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
