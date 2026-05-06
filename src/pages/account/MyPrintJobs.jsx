import React from 'react';
import { Link } from 'react-router-dom';
import { printJobsApi } from '../../api/printJobs';
import { useAsync } from '../../hooks/useAsync';
import styles from './MyPrintJobs.module.css';

export default function MyPrintJobs() {
    const { data, loading, error } = useAsync(printJobsApi.getAllPrintJobs, {
        errorMessage: 'Error al cargar los trabajos de impresión.'
    });

    if (loading) return <div className={styles.container}><p>Cargando dashboard de trabajos...</p></div>;
    if (error) return <div className={styles.container}><p className={styles.errorText}>{error}</p></div>;

    const rawData = data || [];
    const jobsList = Array.isArray(rawData) ? rawData : (rawData.data || rawData.items || []);

    const pricedJobs = jobsList.filter(j => j.status === 'priced');
    const reviewJobs = jobsList.filter(j => j.status === 'review_pending');

    return (
        <div className={styles.container} style={{ paddingTop: '1rem' }}>

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
                                            Job #{job.id} — {job.print_file?.original_name}
                                        </div>
                                        <div className={styles.jobPrice}>
                                            {Number(job.unit_price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                        </div>
                                    </div>
                                    <Link to={`/account/printfiles/${job.print_file?.id}/jobs/${job.id}`}>
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
                                            Job #{job.id} — {job.print_file?.original_name}
                                        </div>
                                        <div className={styles.jobNote}>
                                            Requiere validación manual o forzar continuación.
                                        </div>
                                    </div>
                                    <Link to={`/account/printfiles/${job.print_file?.id}/jobs/${job.id}`}>
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

