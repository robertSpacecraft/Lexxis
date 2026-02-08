import Navbar from '../components/Navbar';
import { authStorage } from '../store/authStorage';
import { Link } from 'react-router-dom';

export default function Home() {
    const user = authStorage.getUser();

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Bienvenido a Lexxis
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        Plataforma de demostración para gestión de catálogo y archivos de impresión.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        <div className="card" style={{ padding: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Catálogo Público</h2>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Explora nuestros productos y variantes disponibles sin necesidad de registro.</p>
                            <Link to="/catalog" className="btn btn-secondary" style={{ width: '100%' }}>Ver Catálogo</Link>
                        </div>

                        <div className="card" style={{ padding: '2rem', borderColor: user ? 'var(--primary)' : 'var(--border)' }}>
                            <h2 style={{ marginBottom: '1rem', color: user ? 'var(--primary-dark)' : 'var(--text-main)' }}>Área Privada</h2>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                                {user
                                    ? `Hola, ${user.name}. Gestiona tus archivos de impresión.`
                                    : 'Accede para gestionar tus archivos de impresión.'}
                            </p>
                            {user ? (
                                <Link to="/account/printfiles" className="btn btn-primary" style={{ width: '100%' }}>Ir a mis Archivos</Link>
                            ) : (
                                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Iniciar Sesión</Link>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '4rem', padding: '2rem', background: '#f1f5f9', borderRadius: '1rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Estado del Sistema</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                            <div>
                                <span className="text-muted text-sm">Estado Auth:</span>
                                <div style={{ fontWeight: 600, color: user ? 'var(--success)' : 'var(--error)' }}>
                                    {user ? 'Autenticado' : 'No Autenticado'}
                                </div>
                            </div>
                            {user && (
                                <>
                                    <div>
                                        <span className="text-muted text-sm">Usuario:</span>
                                        <div style={{ fontWeight: 600 }}>{user.email}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted text-sm">Rol:</span>
                                        <div style={{ fontWeight: 600 }}>{user.role || 'N/A'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
