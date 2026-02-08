import { useState, useEffect } from 'react';
import { printFilesApi } from '../api/printFiles';
import Navbar from '../components/Navbar';

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
            const { data } = await printFilesApi.getPrintFiles();
            setFiles(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los archivos.');
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
            setError('Error al subir el archivo.');
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
            alert('Error al descargar el archivo');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className="page-title">Mis Archivos de Impresión</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Upload Form */}
                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Subir Nuevo Archivo</h2>

                        {uploadSuccess && (
                            <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                {uploadSuccess}
                            </div>
                        )}

                        <form onSubmit={handleUpload}>
                            <div className="input-group">
                                <label className="input-label">Archivo</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Notas (Opcional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="form-input"
                                    rows="3"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={uploading}
                            >
                                {uploading ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : 'Subir Archivo'}
                            </button>
                        </form>
                    </div>

                    {/* Files List */}
                    <div>
                        {loading ? (
                            <div className="spinner" style={{ margin: '0 auto' }}></div>
                        ) : error ? (
                            <div style={{ color: 'var(--error)' }}>{error}</div>
                        ) : files.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <p className="text-muted">No has subido ningún archivo aún.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {files.map(file => (
                                    <div key={file.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{file.original_name}</div>
                                            <div className="text-sm text-muted">
                                                <span>{file.file_extension?.toUpperCase()}</span>
                                                <span style={{ margin: '0 0.5rem' }}>•</span>
                                                <span>{(file.file_size / 1024).toFixed(2)} KB</span>
                                                <span style={{ margin: '0 0.5rem' }}>•</span>
                                                <span>{new Date(file.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {file.status && (
                                                <div style={{ marginTop: '0.25rem' }}>
                                                    <span style={{
                                                        padding: '0.125rem 0.375rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.75rem',
                                                        background: '#f3f4f6',
                                                        color: '#4b5563'
                                                    }}>
                                                        {file.status}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDownload(file.id, file.original_name)}
                                            className="btn btn-secondary"
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
        </>
    );
}
