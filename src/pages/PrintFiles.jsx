import { useState, useEffect } from 'react';
import { printFilesApi } from '../api/printFiles';
import styles from './PrintFiles.module.css';

export default function PrintFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);

    // Form state
    const [selectedFile, setSelectedFile] = useState(null);
    const [notes, setNotes] = useState('');

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const printFiles = await printFilesApi.getPrintFiles();
            setFiles(printFiles || []);
        } catch (err) {
            console.error(err);
            setError(err.message || 'No se pudieron cargar los archivos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setUploadSuccess(null);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        if (notes) formData.append('notes', notes);

        try {
            await printFilesApi.uploadPrintFile(formData);
            setUploadSuccess('Subido correctamente');
            setSelectedFile(null);
            setNotes('');
            // Reset file input
            e.target.reset();
            // Refresh list
            fetchFiles();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al subir el archivo.');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (id, originalName) => {
        try {
            const blob = await printFilesApi.downloadPrintFile(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName || `file-${id}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al descargar el archivo');
        }
    };

    return (
        <div>
            <h1 className={styles.title}>Mis Archivos de Impresión</h1>

                <div className={styles.layout}>
                    {/* Upload Form */}
                    <div className={styles.card}>
                        <h2 className={styles.sectionTitle}>Subir Nuevo Archivo</h2>

                        {uploadSuccess && (
                            <div className={styles.successBox}>
                                {uploadSuccess}
                            </div>
                        )}

                        {error && !loading && (
                            <div className={styles.errorBox}>{error}</div>
                        )}

                        <form onSubmit={handleUpload}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Archivo</label>
                                <div className={styles.fileInputWrapper}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Notas (Opcional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className={styles.formInput}
                                    rows="3"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={uploading}
                            >
                                {uploading ? 'Subiendo...' : 'Subir Archivo'}
                            </button>
                        </form>
                    </div>

                    {/* Files List */}
                    <div>
                        {loading ? (
                            <div className={styles.centerSpinner}>
                                <p>Cargando archivos...</p>
                            </div>
                        ) : files.length === 0 ? (
                            <div className={styles.emptyState}>
                                No has subido ningún archivo aún.
                            </div>
                        ) : (
                            <div className={styles.filesList}>
                                {files.map(file => (
                                    <div key={file.id} className={styles.fileItem}>
                                        <div className={styles.fileInfo}>
                                            <div className={styles.fileName}>{file.original_name}</div>
                                            <div className={styles.fileMeta}>
                                                <span>{file.file_extension?.toUpperCase()}</span>
                                                <span className={styles.metaDot}>•</span>
                                                <span>{(file.file_size / 1024).toFixed(2)} KB</span>
                                                <span className={styles.metaDot}>•</span>
                                                <span>{new Date(file.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {file.status && (
                                                <div className={styles.badgeStatus}>
                                                    {file.status}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDownload(file.id, file.original_name)}
                                            className={styles.downloadBtn}
                                            title="Descargar"
                                        >
                                            ⬇ Descargar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
}
