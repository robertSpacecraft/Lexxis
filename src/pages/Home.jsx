import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { catalogApi } from '../api/catalog';
import styles from './Home.module.css';

// Hero Images
import footwearHero from '../assets/images/hero/hero_footwear_shop_1775204761637.png';
import customPrintHero from '../assets/images/hero/hero_custom_print_1775204777415.png';

export default function Home() {
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                // Fetch top 5 products. Mocking 'top sellers' with the first 5 active items.
                const { items } = await catalogApi.getProducts();
                const activeItems = items.filter(t => t.is_active !== false);
                setTopProducts(activeItems.slice(0, 5));
            } catch (err) {
                console.error("Failed to load top products", err);
            }
        };
        fetchTopProducts();
    }, []);

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

                    <Link to="/account/printfiles" className={styles.heroCard} style={{ backgroundImage: `url(${customPrintHero}), linear-gradient(var(--color-surface), var(--color-border))` }}>
                        <div className={styles.heroOverlay}></div>
                        <div className={styles.heroContent}>
                            <h2 className={styles.heroTitle}>Servicio de Impresión 3D</h2>
                            <div className={styles.heroSubtitle}>Formatos: SLT, GCODE, OBJ</div>
                            <span className={styles.heroBtn}>Sube tu archivo</span>
                        </div>
                    </Link>
                </section>

                {/* Top Sellers Carousel */}
                <section className={styles.topSellersSection}>
                    <h3 className={styles.topSellersTitle}>Modelos más vendidos</h3>
                    <div className={styles.carousel}>
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <span key={product.id} className={styles.carouselItem}>
                                    {product.name} <span className={styles.price}>- 89€</span> {/* Dummy price since price is on variants */}
                                    {index < topProducts.length - 1 && <span style={{margin: '0 1rem', color: 'var(--color-border)'}}>|</span>}
                                </span>
                            ))
                        ) : (
                            <div className={styles.carouselItem}>Cargando modelos...</div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
