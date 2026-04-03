import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { authStorage } from '../store/authStorage';
import Navbar from '../components/Navbar';
import styles from './Login.module.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: 'demo@lexxis.test', password: 'password' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await authApi.login(credentials);
            if (result.token) {
                authStorage.setToken(result.token);
                authStorage.setUser(result.user);
                navigate('/');
            } else {
                setError('Respuesta inválida del servidor');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Credenciales incorrectas o error de conexión');
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
                        <h1 className={styles.title}>Iniciar Sesión</h1>
                        <p className={styles.subtitle}>Accede a tu área privada</p>
                    </div>

                    {error && (
                        <div className={styles.errorBox}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className={styles.demoInfo}>
                        <p>Credenciales demo:</p>
                        <p>demo@lexxis.test / password</p>
                    </div>
                </div>
            </div>
        </>
    );
}
