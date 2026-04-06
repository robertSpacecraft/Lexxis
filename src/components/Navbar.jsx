import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../store/authStorage';
import { cartApi } from '../api/cartApi';
import styles from './Navbar.module.css';
import logoUrl from '../assets/images/brand/Logo_Lexxis_versión_simplificada_horizontal-removebg-preview.png';

const DropdownArrow = () => (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.31658 15.6834 4.59289 16.35 5.14493 16.35H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
        <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
    </svg>
);

const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function Navbar() {
    const navigate = useNavigate();
    const user = authStorage.getUser();
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = useCallback(async () => {
        try {
            const data = await cartApi.getCart();
            const items = data?.items || [];
            setCartCount(items.length);
        } catch (err) {
            console.error('Error fetching cart count:', err);
        }
    }, []);

    useEffect(() => {
        fetchCartCount();

        const handleUpdate = () => {
            fetchCartCount();
        };

        window.addEventListener('lexxis-cart-updated', handleUpdate);
        return () => window.removeEventListener('lexxis-cart-updated', handleUpdate);
    }, [fetchCartCount]);

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
                    <Link to="/news" className={styles.navLink}>Actualidad</Link>
                    <Link to="/catalog" className={styles.navLink}>Shop</Link>
                    <Link to="/services/print3d" className={styles.navLink}>Servicios</Link>
                    <Link to="/about" className={styles.navLink}>Quiénes somos</Link>
                    <Link to="/contact" className={styles.navLink}>Contacto</Link>
                </div>

                <div className={styles.userSection}>
                    <div className={styles.langSelector}>
                        ES <DropdownArrow />
                    </div>

                    <Link to="/account/cart" className={styles.iconWrapper}>
                        <div className={styles.cartIcon}>
                            <CartIcon />
                            {cartCount > 0 && (
                                <span className={styles.cartBadge}>{cartCount}</span>
                            )}
                        </div>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/account" className={styles.userInfo} style={{textDecoration:'none', color:'inherit'}}>
                                <span className={styles.userName}>{user.name}</span>
                                <span className={styles.userEmail}>{user.email}</span>
                            </Link>
                            <div className={styles.iconWrapper} onClick={handleLogout} title="Cerrar sesión">
                                Cerrar Sesión
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className={styles.iconWrapper}>
                            <UserIcon /> <span style={{fontSize: '0.875rem'}}>Iniciar sesión</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
