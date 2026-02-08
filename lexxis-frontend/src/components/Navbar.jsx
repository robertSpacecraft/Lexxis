import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../store/authStorage';
import { useState } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const user = authStorage.getUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        authStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, marginBottom: '2rem' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.025em' }}>
                    Lexxis<span style={{ color: 'var(--text-main)' }}>.demo</span>
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/catalog" style={{ fontWeight: 500 }}>Catálogo</Link>
                    {user && (
                        <Link to="/account/printfiles" style={{ fontWeight: 500 }}>Mis Archivos</Link>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <div className="text-sm text-muted" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
                                <span style={{ fontSize: '0.75rem' }}>{user.email}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
