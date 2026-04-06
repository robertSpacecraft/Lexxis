import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { printJobsApi } from '../../api/printJobs';
import { printFilesApi } from '../../api/printFiles';
import { cartApi } from '../../api/cartApi';
import styles from './PrintJobConfig.module.css';

// Mocked Materials as requested in the plan
const MOCKED_MATERIALS = [
    { id: 1, name: 'PLA Estándar', colors: ['Blanco', 'Negro', 'Gris', 'Rojo'] },
    { id: 2, name: 'PETG Resistencia', colors: ['Transparente', 'Negro', 'Naranja'] },
];

export default function PrintJobConfig() {
    const { printFileId, printJobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    
    const [toastMessage, setToastMessage] = useState('');

    // Form inputs
    const [formParams, setFormParams] = useState({
        material_id: '',
        technology: 'fdm', // Default as per requirements
        color_name: '',
        quantity: 1,
        infill_percent: 20,
        scale_percent: 100
    });

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                // Fetch file info for context
                const fileData = await printFilesApi.getPrintFile(printFileId);
                setFileInfo(fileData);

                if (printJobId) {
                    const jobData = await printJobsApi.getPrintJob(printFileId, printJobId);
                    setJob(jobData);
                    setFormParams({
                        material_id: jobData.material_id || MOCKED_MATERIALS[0].id,
                        technology: jobData.technology || 'fdm',
                        color_name: jobData.color_name || MOCKED_MATERIALS[0].colors[0],
                        quantity: jobData.quantity || 1,
                        infill_percent: jobData.infill_percent || 20,
                        scale_percent: jobData.scale_percent || 100
                    });
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error al cargar la información del trabajo.');
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, [printFileId, printJobId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormParams(prev => {
            const updated = { ...prev, [name]: value };
            // Reset color if material changes
            if (name === 'material_id') {
                const mat = MOCKED_MATERIALS.find(m => String(m.id) === String(value));
                updated.color_name = mat ? mat.colors[0] : '';
            }
            return updated;
        });
    };

    const handleCalculate = async () => {
        setSaving(true);
        setError(null);
        try {
            // Ensure numbers
            const payload = {
                ...formParams,
                quantity: Number(formParams.quantity),
                infill_percent: Number(formParams.infill_percent),
                scale_percent: Number(formParams.scale_percent),
                material_id: Number(formParams.material_id)
            };

            await printJobsApi.updatePrintJob(printFileId, printJobId, payload);
            // FIX 1: firma correcta (printFileId, printJobId)
            const updatedJob = await printJobsApi.recalculatePrintJob(printFileId, printJobId);

            // FIX 5: guard de respuesta
            if (!updatedJob || typeof updatedJob !== 'object') {
                throw new Error('Respuesta inválida del servidor al recalcular.');
            }

            setJob(updatedJob);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al calcular el presupuesto.');
        } finally {
            setSaving(false);
        }
    };

    const handleContinueWithoutReview = async () => {
        if (!job) return;
        setSaving(true);
        try {
            const updatedJob = await printJobsApi.continueWithoutReview(printFileId, job.id);
            setJob(updatedJob);
        } catch (err) {
            console.error(err);
            setError(err.message || 'No se pudo continuar sin revisión.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddToCart = async () => {
        if (!job || job.status !== 'priced') return;
        setSaving(true);
        try {
            await cartApi.addPrintJob(job.id, 1);
            // Refetch job so backend confirms in_cart status and UI updates correctly
            const updatedJob = await printJobsApi.getPrintJob(printFileId, printJobId);
            setJob(updatedJob);
            setToastMessage('Añadido al carrito con éxito');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al añadir al carrito.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!window.confirm(`¿Eliminar el trabajo #${printJobId}? Esta acción no se puede deshacer.`)) return;
        try {
            await printJobsApi.deletePrintJob(printFileId, printJobId);
            navigate(`/account/printfiles/${printFileId}`);
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || err.message || 'No se ha podido eliminar el trabajo de impresión.';
            setError(msg);
        }
    };


    const selectedMatObj = MOCKED_MATERIALS.find(m => String(m.id) === String(formParams.material_id));

    if (loading) return <div className={styles.container}><p>Cargando configurador...</p></div>;
    if (error && !job) return <div className={styles.container}><p>{error}</p><Link to="/account/printfiles" className={styles.backLink}>Volver a mis archivos</Link></div>;

    return (
        <div className={styles.container}>
            <Link to={`/account/printfiles/${printFileId}`} className={styles.backLink}>
                &larr; Volver al Archivo
            </Link>

            <h1 className={styles.title}>
                Trabajo #{job?.id || ''}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                Archivo base: <strong>{fileInfo?.original_name || 'Desconocido'}</strong>
            </p>

            {error && <div className={styles.reviewBox} style={{backgroundColor: '#ffebee', borderColor: 'var(--color-error)'}}>
                <p style={{color: 'var(--color-error)'}}>{error}</p>
            </div>}

            <div className={styles.layout}>
                {/* Formulario Configuración */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Parámetros de Impresión</h2>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tecnología</label>
                        <select name="technology" className={styles.selectInput} value={formParams.technology} disabled>
                            <option value="fdm">FDM (Fused Deposition Modeling)</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Material</label>
                        <select name="material_id" className={styles.selectInput} value={formParams.material_id} onChange={handleChange}>
                            <option value="">Seleccione material...</option>
                            {MOCKED_MATERIALS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Color</label>
                        <select name="color_name" className={styles.selectInput} value={formParams.color_name} onChange={handleChange} disabled={!selectedMatObj}>
                            {selectedMatObj?.colors.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Escala (%)</label>
                        <input type="number" name="scale_percent" className={styles.numberInput} value={formParams.scale_percent} onChange={handleChange} min="10" max="500" />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Relleno / Infill (%)</label>
                        <input type="number" name="infill_percent" className={styles.numberInput} value={formParams.infill_percent} onChange={handleChange} min="0" max="100" />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Cantidad</label>
                        <input type="number" name="quantity" className={styles.numberInput} value={formParams.quantity} onChange={handleChange} min="1" max="100" />
                    </div>

                    <button className={styles.btnPrimary} onClick={handleCalculate} disabled={saving || !formParams.material_id}>
                        {saving && (!job || job.status !== 'review_pending') ? 'Calculando...' : 'Calcular Precio'}
                    </button>

                    <button className={styles.btnDanger} onClick={handleDeleteJob} disabled={saving}>
                        Eliminar trabajo
                    </button>
                </div>

                {/* Resumen y Status */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Análisis y Presupuesto</h2>
                    
                    {!job ? (
                        <p style={{color: 'var(--color-text-muted)'}}>Configura los parámetros y pulsa calcular para obtener un presupuesto.</p>
                    ) : (
                        <>
                            {/* Summary Data */}
                            <div style={{marginBottom: 'var(--spacing-lg)'}}>
                                <div className={styles.summaryRow}>
                                    <span>Volumen estimado:</span>
                                    <strong>{job.estimated_volume_cm3 ? `${Number(job.estimated_volume_cm3).toFixed(2)} cm³` : '-'}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Material estimado:</span>
                                    <strong>{job.estimated_material_g ? `${Number(job.estimated_material_g).toFixed(2)} g` : '-'}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Tiempo de impresión:</span>
                                    <strong>{job.estimated_time_min ? `${job.estimated_time_min} min` : '-'}</strong>
                                </div>
                            </div>

                            {/* Status logic */}
                            {job.status === 'review_pending' && (
                                <div className={styles.reviewBox}>
                                    <div className={styles.reviewTitle}>Requiere Revisión Manual</div>
                                    <p className={styles.reviewText}>
                                        El análisis automático de la pieza no ha podido certificar su coste con total seguridad.
                                        Puedes esperar a que un técnico valide la pieza o continuar asumiendo un riesgo estructural pre-calculado por la plataforma.
                                    </p>
                                    
                                    {job.pricing_breakdown?.review_reasons && (
                                        <ul style={{fontSize: 'var(--font-size-body-sm)', marginLeft: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)'}}>
                                            {job.pricing_breakdown.review_reasons.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    )}

                                    <button className={styles.btnSecondary} onClick={handleContinueWithoutReview} disabled={saving}>
                                        Continuar sin revisión
                                    </button>
                                </div>
                            )}

                            {job.status === 'priced' && (
                                <div className={styles.readyBox}>
                                    <div className={styles.readyTitle}>✅ Listo para comprar</div>
                                    <p className={styles.reviewText}>
                                        El presupuesto se ha generado correctamente en base a los parámetros y validación del modelo.
                                    </p>
                                    
                                    <div className={styles.priceDisplay}>
                                        {/* FIX 4: render seguro con unit_price */}
                                        {Number.isFinite(Number(job.unit_price))
                                            ? `${Number(job.unit_price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
                                            : '—'
                                        }
                                    </div>

                                    <button className={styles.btnPrimary} onClick={handleAddToCart} disabled={saving}>
                                        {saving ? 'Añadiendo...' : 'Añadir al carrito'}
                                    </button>
                                </div>
                            )}

                            {job.status === 'in_cart' && (
                                <div className={styles.readyBox}>
                                    <div className={styles.readyTitle}>En el carrito</div>
                                    <p className={styles.reviewText}>Este trabajo ya está en tu carrito.</p>
                                    <Link to="/account/cart">
                                        <button className={styles.btnSecondary} style={{marginTop: 'var(--spacing-sm)'}}>
                                            Ir al carrito
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {toastMessage && (
                <div className={styles.toastSuccess}>
                    <span>{toastMessage}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => navigate('/account/cart')}>Ir al carrito</button>
                        <button onClick={() => setToastMessage('')} style={{ backgroundColor: 'transparent', border: '1px solid white' }}>Seguir configurando</button>
                    </div>
                </div>
            )}
        </div>
    );
}
