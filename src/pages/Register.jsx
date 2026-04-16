import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { authStorage } from '../store/authStorage';
import Navbar from '../components/Navbar';
import styles from './Register.module.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.password_confirmation) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            name: formData.name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation
        };

        if (formData.phone) {
            payload.phone = formData.phone;
        }

        try {
            const result = await authApi.register(payload);
            
            // Backend valid response mapping
            const responseData = result.data || result;
            const token = responseData.token;
            const user = responseData.user;

            if (token && user) {
                authStorage.setToken(token);
                authStorage.setUser(user);
                navigate('/account/profile');
            } else {
                setError('No se pudo completar el registro. Respuesta inválida.');
            }
        } catch (err) {
            console.error('Error en registro:', err);
            // Handle validation errors via apiClient parsing convention
            if (err.errors) {
                const errorMessages = Object.values(err.errors).flat().join('\n');
                setError(errorMessages);
            } else if (err.response?.status === 422 && err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join('\n');
                setError(errorMessages);
            } else {
                setError(err.message || 'Error de conexión o fallo al registrar.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Crear Cuenta</h1>
                        <p className={styles.subtitle}>Únete a Lexxis</p>
                    </div>

                    {error && (
                        <div className={styles.errorBox}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    required
                                    maxLength={255}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Apellidos</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className={styles.formInput}
                                    required
                                    maxLength={255}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                maxLength={255}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Teléfono <span>(Opcional)</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.formInput}
                                maxLength={50}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Confirmar Contraseña</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarme'}
                        </button>
                    </form>

                    <div className={styles.linkInfo}>
                        ¿Ya tienes cuenta? <Link to="/login" className={styles.link}>Inicia sesión aquí</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
