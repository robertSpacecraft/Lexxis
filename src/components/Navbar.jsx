import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../store/authStorage';
import styles from './Navbar.module.css';
import logoUrl from '../assets/images/brand/Logo_Lexxis_versión_simplificada_horizontal-removebg-preview.png';

export default function Navbar() {
    const navigate = useNavigate();
    const user = authStorage.getUser();

    const handleLogout = () => {
        authStorage.clear();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.brandLink}>
                    <img src={logoUrl} alt="Lexxis Logo" className={styles.brandLogo} />
                </Link>

                <div className={styles.navLinks}>
                    <Link to="/catalog" className={styles.navLink}>Catálogo</Link>
                    {user && (
                        <Link to="/account/printfiles" className={styles.navLink}>Mis Archivos</Link>
                    )}
                </div>

                <div className={styles.userSection}>
                    {user ? (
                        <>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{user.name}</span>
                                <span className={styles.userEmail}>{user.email}</span>
                            </div>
                            <button onClick={handleLogout} className={styles.btnSecondary}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className={styles.btnPrimary}>
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
