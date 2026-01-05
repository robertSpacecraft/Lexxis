import { Link } from "react-router-dom";
import { useAuth } from "../../providers/useAuth";
import styles from "./Header.module.css";
import logoImg from '../../../assets/images/brand/Lexxis_Texto.svg';

export default function Header() {
    const { user, logout, isBootstrapping } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.logoContainer}>
                    <img src={logoImg} alt="Lexxis Logo" className={styles.logoImage} />
                </Link>

                <nav className={styles.nav}>
                    <Link to="/products" className={styles.link}>Productos</Link>
                    <Link to="/prints" className={styles.link}>Imprimir</Link>

                    {!isBootstrapping && user ? (
                        <div className={styles.authBlock}>
                            <Link to="/account" className={styles.link}>Cuenta</Link>
                            <button onClick={logout} className={styles.buttonOut}>Salir</button>
                        </div>
                    ) : (
                        <div className={styles.authBlock}>
                            <Link to="/login" className={styles.link}>Acceder</Link>
                            <Link to="/register" className={styles.buttonIn}>Empezar</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}