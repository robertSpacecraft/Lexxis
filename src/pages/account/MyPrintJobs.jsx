import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { printFilesApi } from '../../api/printFiles';
import { printJobsApi } from '../../api/printJobs';
import styles from './MyPrintJobs.module.css';

export default function MyPrintJobs() {
    const [jobsList, setJobsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllJobs = async () => {
            setLoading(true);
            try {
                // WORKAROUND: Limitación Backend.
                // Como no existe GET /api/print-jobs, hay que iterar por todos los archivos del usuario (N+1).
                // En un escenario real con muchos archivos, esto penalizaría la red.
                const files = await printFilesApi.getPrintFiles();
                if (!files || files.length === 0) {
                    setJobsList([]);
                    setLoading(false);
                    return;
                }

                const allJobsNested = await Promise.all(
                    files.map(async (file) => {
                        try {
                            const jobs = await printJobsApi.getPrintJobs(file.id);
                            // Adjuntamos la info básica del archivo para contexto visual
                            return jobs.map(j => ({ ...j, fileContext: file }));
                        } catch (e) {
                            console.error("Error obteniendo jobs para archivo", file.id);
                            return [];
                        }
                    })
                );

                const flattened = allJobsNested.flat();
                setJobsList(flattened);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error al cargar los trabajos de impresión.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, []);

    if (loading) return <div className={styles.container}><p>Cargando dashboard de trabajos...</p></div>;
    if (error) return <div className={styles.container}><p className={styles.errorText}>{error}</p></div>;

    const pricedJobs = jobsList.filter(j => j.status === 'priced');
    const reviewJobs = jobsList.filter(j => j.status === 'review_pending');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Trabajos de Impresión</h1>
            <p className={styles.subtitle}>
                Gestiona tus configuraciones y añade al carrito las impresiones listas.
            </p>

            <div className={styles.layout}>
                <div className={styles.card}>
                    <h2 className={`${styles.sectionTitle} ${styles.sectionTitlePriced}`}>
                        Listos para Comprar ({pricedJobs.length})
                    </h2>

                    {pricedJobs.length === 0 ? (
                        <p className={styles.emptyText}>No tienes trabajos pendientes de pago.</p>
                    ) : (
                        <ul className={styles.jobList}>
                            {pricedJobs.map(job => (
                                <li key={job.id} className={`${styles.jobItem} ${styles.jobItemPriced}`}>
                                    <div className={styles.jobMeta}>
                                        <div className={styles.jobTitle}>
                                            Job #{job.id} — {job.fileContext?.original_name}
                                        </div>
                                        <div className={styles.jobPrice}>
                                            {Number(job.unit_price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                        </div>
                                    </div>
                                    <Link to={`/account/printfiles/${job.fileContext?.id}/jobs/${job.id}`}>
                                        <button className={styles.btnPrimary}>Configurar / Añadir</button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.card}>
                    <h2 className={`${styles.sectionTitle} ${styles.sectionTitleReview}`}>
                        Pendientes de Revisión ({reviewJobs.length})
                    </h2>

                    {reviewJobs.length === 0 ? (
                        <p className={styles.emptyText}>No hay trabajos requiriendo atención.</p>
                    ) : (
                        <ul className={styles.jobList}>
                            {reviewJobs.map(job => (
                                <li key={job.id} className={`${styles.jobItem} ${styles.jobItemReview}`}>
                                    <div className={styles.jobMeta}>
                                        <div className={styles.jobTitle}>
                                            Job #{job.id} — {job.fileContext?.original_name}
                                        </div>
                                        <div className={styles.jobNote}>
                                            Requiere validación manual o forzar continuación.
                                        </div>
                                    </div>
                                    <Link to={`/account/printfiles/${job.fileContext?.id}/jobs/${job.id}`}>
                                        <button className={styles.btnSecondary}>Gestionar</button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

