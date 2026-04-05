import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './News.module.css';

// Import Generated Images
import birthOfLexxis from '../assets/images/news/news_birth_of_lexxis.png';
import sustainability from '../assets/images/news/news_sustainability.png';
import genesisCollection from '../assets/images/news/news_genesis_collection.png';

const NewsCard = ({ image, title, body }) => (
    <article className={styles.newsCard}>
        <div className={styles.imageWrapper}>
            <img src={image} alt={title} className={styles.newsImage} />
        </div>
        <div className={styles.content}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.body}>{body}</p>
        </div>
    </article>
);

const News = () => {
    return (
        <div className={styles.newsPageWrapper}>
            <Navbar />
            
            <main className={styles.mainBody}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <h1>Actualidad</h1>
                        <h2>Nuestros últimos hitos</h2>
                    </header>

                    <div className={styles.newsGrid}>
                        <NewsCard 
                            image={birthOfLexxis} 
                            title="El futuro del calzado comienza aquí" 
                            body="Lexxis Technologies nace oficialmente para fusionar el diseño digital con la fabricación aditiva. Bajo la visión de Roberto Amorós, el proyecto busca transformar el sector del calzado eliminando las barreras de la fabricación tradicional mediante impresión 3D." 
                        />
                        <NewsCard 
                            image={sustainability} 
                            title="Producción inteligente, residuo cero" 
                            body="Nuestro compromiso con el medio ambiente es estructural. Gracias a la impresión 3D, fabricamos solo lo que se necesita, eliminando el stock masivo y permitiendo reutilizar los residuos generados. Además, operamos con energía limpia, integrando placas solares en nuestro proceso de adecuación del local." 
                        />
                        <NewsCard 
                            image={genesisCollection} 
                            title="Diseños que desafían lo convencional" 
                            body="Estamos trabajando en los primeros modelos exclusivos de Lexxis. Una colección que llevará la personalización y la ergonomía a un nuevo nivel. Suscríbete para ser el primero en conocer el lanzamiento." 
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default News;
