import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BestSellingModels from '../features/catalog/components/BestSellingModels';
import styles from './Home.module.css';

// Hero Images
import footwearHero from '../assets/images/hero/hero_footwear_shop_1775204761637.png';
import customPrintHero from '../assets/images/hero/hero_custom_print_1775204777415.png';

export default function Home() {
    return (
        <div className={styles.homeContainer}>
            <Navbar />
            
            <main className={styles.mainBody}>
                {/* Hero Dual Box */}
                <section className={styles.heroDualBox}>
                    <Link to="/catalog" className={styles.heroCard} style={{ backgroundImage: `url(${footwearHero}), linear-gradient(var(--color-surface), var(--color-border))` }}>
                        <div className={styles.heroOverlay}></div>
                        <div className={styles.heroContent}>
                            <h2 className={styles.heroTitle}>Catálogo de Calzado 3D</h2>
                            <div className={styles.heroSubtitle}>Descubre la nueva colección</div>
                            <span className={styles.heroBtn}>Shop</span>
                        </div>
                    </Link>

                    <Link to="/services/print3d" className={styles.heroCard} style={{ backgroundImage: `url(${customPrintHero}), linear-gradient(var(--color-surface), var(--color-border))` }}>
                        <div className={styles.heroOverlay}></div>
                        <div className={styles.heroContent}>
                            <h2 className={styles.heroTitle}>Servicio de Impresión 3D</h2>
                            <div className={styles.heroSubtitle}>Formatos: SLT, GCODE, OBJ</div>
                            <span className={styles.heroBtn}>Sube tu archivo</span>
                        </div>
                    </Link>
                </section>

                <BestSellingModels />
            </main>

            <Footer />
        </div>
    );
}
