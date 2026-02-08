import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { authStorage } from '../store/authStorage';
import Navbar from '../components/Navbar';

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
            const { data } = await authApi.login(credentials);
            if (data.token) {
                authStorage.setToken(data.token);
                authStorage.setUser(data.user);
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
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>Iniciar Sesión</h1>
                        <p className="text-muted">Accede a tu área privada</p>
                    </div>

                    {error && (
                        <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : 'Entrar'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem' }} className="text-muted">
                        <p>Credenciales demo:</p>
                        <p>demo@lexxis.test / password</p>
                    </div>
                </div>
            </div>
        </>
    );
}
