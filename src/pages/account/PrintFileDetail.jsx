import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { printFilesApi } from '../../api/printFiles';
import { printJobsApi } from '../../api/printJobs';

import styles from './PrintJobConfig.module.css'; // Reutilizando la limpieza corporativa

export default function PrintFileDetail() {
    const { printFileId } = useParams();
    const navigate = useNavigate();

    const [fileInfo, setFileInfo] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const fileData = await printFilesApi.getPrintFile(printFileId);
                setFileInfo(fileData);

                // Fetch jobs from this file
                const jobsData = await printJobsApi.getPrintJobs(printFileId);
                setJobs(jobsData || []);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error al cargar el archivo.');
            } finally {
                setLoading(false);
            }
        };

        if (printFileId) {
            initData();
        }
    }, [printFileId]);

    const handleCreateJob = () => {
        navigate(`/account/printfiles/${printFileId}/configure`);
    };

    const handleDeleteFile = async () => {
        if (!window.confirm(`¿Eliminar el archivo "${fileInfo?.original_name}"? Se eliminarán también sus trabajos asociados.`)) return;
        try {
            await printFilesApi.deletePrintFile(printFileId);
            navigate('/account/printfiles');
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || err.message || 'No se ha podido eliminar el archivo.';
            setError(msg);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm(`¿Eliminar el trabajo #${jobId}? Esta acción no se puede deshacer.`)) return;
        try {
            await printJobsApi.deletePrintJob(printFileId, jobId);
            const jobsData = await printJobsApi.getPrintJobs(printFileId);
            setJobs(jobsData || []);
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || err.message || 'No se ha podido eliminar el trabajo de impresión.';
            setError(msg);
        }
    };

    if (loading) return <div className={styles.container}><p>Cargando detalles...</p></div>;
    if (error) return <div className={styles.container}><p>{error}</p><Link to="/account/printfiles" className={styles.backLink}>Volver</Link></div>;

    return (
        <div className={styles.container}>
            <Link to="/account/printfiles" className={styles.backLink}>
                &larr; Volver a Mis Archivos
            </Link>

            <h1 className={styles.title}>Detalles de: {fileInfo?.original_name || `Archivo #${printFileId}`}</h1>

            <div className={styles.layout}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Información del Modelo</h2>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '1rem', color: 'var(--color-text)' }}>
                        <li style={{ marginBottom: '8px' }}><strong>ID:</strong> {fileInfo.id}</li>
                        <li style={{ marginBottom: '8px' }}><strong>Extensión:</strong> {fileInfo.file_extension}</li>
                        <li style={{ marginBottom: '8px' }}><strong>Tamaño:</strong> {(fileInfo.file_size / 1024).toFixed(2)} KB</li>
                        <li style={{ marginBottom: '8px' }}><strong>Subido:</strong> {new Date(fileInfo.created_at).toLocaleString()}</li>
                    </ul>

                    <button className={styles.btnSecondary} onClick={handleCreateJob}>
                        + Nueva Configuración de Impresión
                    </button>
                    <button className={styles.btnDanger} onClick={handleDeleteFile} style={{ marginTop: 'var(--spacing-xs)' }}>
                        Eliminar archivo
                    </button>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Trabajos (PrintJobs)</h2>
                    {jobs.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>No hay trabajos configurados para este archivo.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {jobs.map(job => (
                                <li key={job.id} style={{ marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>Job #{job.id}</strong>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                                {job.status === 'priced' && <span style={{ color: 'var(--color-success)' }}>Lista</span>}
                                                {job.status === 'review_pending' && <span style={{ color: 'var(--color-warning)' }}>Revision Pdte.</span>}
                                                {job.status === 'in_cart' && <span>🛒 En carrito</span>}
                                                {['priced', 'review_pending', 'in_cart'].indexOf(job.status) === -1 && <span>Estado: {job.status}</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
                                            <Link to={`/account/printfiles/${printFileId}/jobs/${job.id}`}>
                                                <button className={styles.btnSecondary} style={{ padding: '4px 12px', marginTop: 0, width: 'auto' }}>Ver trabajo</button>
                                            </Link>
                                            <button
                                                className={styles.btnDangerInline}
                                                onClick={() => handleDeleteJob(job.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
