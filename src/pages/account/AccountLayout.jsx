import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './AccountLayout.module.css';

export default function AccountLayout() {
    return (
        <div className={styles.layoutContainer}>
            <Navbar />
            
            <main className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    <NavLink 
                        to="/account/profile" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    >
                        Mi Perfil
                    </NavLink>
                    <NavLink 
                        to="/account/designs" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    >
                        Mis Diseños
                    </NavLink>
                    <NavLink 
                        to="/account/cart" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    >
                        Mi Carrito
                    </NavLink>
                    <NavLink 
                        to="/account/orders" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    >
                        Mis Pedidos
                    </NavLink>
                    <NavLink 
                        to="/account/printfiles" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    >
                        Archivos 3D
                    </NavLink>
                </aside>

                <div className={styles.contentArea}>
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}
