import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { printFilesApi } from '../api/printFiles';
import { printJobsApi } from '../api/printJobs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './ServicePrint3D.module.css';

export default function ServicePrint3D() {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [statusText, setStatusText] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setError(null);
        setStatusText('Subiendo archivo...');

        const formData = new FormData();
        formData.append('file', selectedFile);
        if (notes) formData.append('notes', notes);

        try {
            const uploadedFile = await printFilesApi.uploadPrintFile(formData);
            
            if (uploadedFile && uploadedFile.id) {
                setStatusText('Procesando archivo e iniciando trabajo...');
                try {
                    // Try to auto-create job so the transition is fluid
                    const newJob = await printJobsApi.createPrintJob(uploadedFile.id, {
                        technology: 'fdm',
                        material_id: 1, 
                        color_name: 'Blanco',
                        quantity: 1,
                        infill_percent: 20,
                        scale_percent: 100
                    });
                    
                    // Transition UX visual queue
                    setTimeout(() => {
                        navigate(`/account/printfiles/${uploadedFile.id}/jobs/${newJob.id}`);
                    }, 800);
                    
                } catch (jobErr) {
                    console.error("Error creating job:", jobErr);
                    navigate(`/account/printfiles/${uploadedFile.id}`);
                }
            } else {
                navigate('/account/printfiles');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al subir el archivo.');
            setUploading(false);
            setStatusText('');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Servicio de Impresión 3D</h1>
                    <p className={styles.subtitle}>
                        Sube tu modelo digital y procesaremos su viabilidad geométrica para darte un presupuesto al instante.
                    </p>
                </div>

                <div className={styles.uploadCard}>
                    {error && (
                        <div className={styles.errorBox}>{error}</div>
                    )}

                    {!uploading ? (
                        <form onSubmit={handleUpload}>
                            <div className={styles.inputGroup}>
                                <div className={styles.fileInputWrapper}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                        required
                                        accept=".stl,.obj,.gcode"
                                    />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        Formatos soportados: .stl, .obj, .gcode (Máx. 50MB)
                                    </span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Notas y especificaciones críticas (Opcional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className={styles.formInput}
                                    rows="3"
                                    placeholder="Indica si esta pieza requiere resistencia especial, alta temperatura, o es meramente decorativa."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={!selectedFile}
                            >
                                Subir Archivo y Configurar
                            </button>
                        </form>
                    ) : (
                        <div className={styles.processingState}>
                            <div className={styles.spinner}></div>
                            <h3 className={styles.processingTitle}>{statusText}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                Por favor no cierres esta ventana.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
