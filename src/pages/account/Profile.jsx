import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { authStorage } from '../../store/authStorage';
import styles from './Profile.module.css';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile();
                setFormData({
                    name: data.name || '',
                    email: data.email || '' // Usually email is returned but not editable easily
                });
                
                // Sync auth storage just in case
                const currentUser = authStorage.getUser() || {};
                authStorage.setUser({ ...currentUser, ...data });
                
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error al cargar el perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Only sending name since email usually requires special validation/verification flows
            const payload = { name: formData.name };
            const updatedUser = await userApi.updateProfile(payload);
            setSuccess('Perfil actualizado correctamente.');
            
            // Sync local storage
            const currentUser = authStorage.getUser() || {};
            authStorage.setUser({ ...currentUser, ...updatedUser });
            
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al guardar el perfil.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className={styles.centerSpinner}>Cargando perfil...</div>;
    }

    return (
        <div>
            <h1 className={styles.title}>Mi Perfil</h1>

            {error && <div className={styles.errorMsg}>{error}</div>}
            {success && <div className={styles.successMsg}>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nombre completo</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Correo electrónico</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        className={`${styles.input} ${styles.inputDisabled}`}
                        disabled
                    />
                    <span className={styles.helpText}>El correo electrónico no se puede modificar desde aquí.</span>
                </div>

                <div className={styles.actions}>
                    <button 
                        type="submit" 
                        className={styles.btnPrimary}
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}
