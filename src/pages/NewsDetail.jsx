import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './NewsDetail.module.css';

import birthOfLexxis from '../assets/images/news/news_birth_of_lexxis.png';
import sustainability from '../assets/images/news/news_sustainability.png';
import genesisCollection from '../assets/images/news/news_genesis_collection.png';

const NEWS_CONTENT = {
    'futuro-calzado': {
        title: 'El futuro del calzado comienza aquí',
        image: birthOfLexxis,
        content: (
            <>
                <h3>Introducción</h3>
                <p>La industria del calzado está experimentando una transición progresiva hacia modelos productivos más flexibles, digitales y sostenibles. En este contexto nace Lexxis Technologies, con el objetivo de integrar diseño digital y fabricación aditiva dentro de un mismo flujo de trabajo.</p>
                
                <h3>Desarrollo</h3>
                <p>Tradicionalmente, el desarrollo de un producto en el sector ha estado condicionado por procesos largos, dependencia de moldes físicos y limitaciones en la personalización. La impresión 3D introduce una alternativa basada en la fabricación bajo demanda, donde cada unidad puede adaptarse sin penalizar el proceso productivo.</p>
                
                <p>Este enfoque permite:</p>
                <ul>
                    <li>Reducir iteraciones físicas en fase de diseño</li>
                    <li>Minimizar residuos asociados a sobreproducción</li>
                    <li>Acelerar el paso de prototipo a producto final</li>
                </ul>
                
                <p>Además, el uso de herramientas CAD avanzadas y simulación permite anticipar comportamientos del producto antes de su fabricación, reduciendo incertidumbre técnica.</p>
                
                <h3>Contexto tecnológico</h3>
                <p>Centros tecnológicos como INESCOP llevan años trabajando en la integración de estas tecnologías dentro del sector, validando materiales, procesos y aplicaciones industriales reales.<br/>
                <a href="https://www.inescop.es" target="_blank" rel="noopener noreferrer">https://www.inescop.es</a></p>
                
                <h3>Conclusión</h3>
                <p>Lexxis se sitúa dentro de esta evolución, explorando cómo combinar diseño, ingeniería y fabricación en un sistema más adaptable, donde el producto deja de ser una pieza estática y pasa a formar parte de un proceso dinámico.</p>
            </>
        )
    },
    'produccion-residuo-cero': {
        title: 'Producción inteligente, residuo cero',
        image: sustainability,
        content: (
            <>
                <h3>Introducción</h3>
                <p>El concepto de “residuo cero” en fabricación no implica ausencia total de impacto, sino una optimización sistemática de recursos. En el ámbito del calzado, esto supone replantear tanto los materiales como los procesos productivos.</p>
                
                <h3>Problema actual</h3>
                <p>Los modelos tradicionales se basan en:</p>
                <ul>
                    <li>Producción en serie con previsión de demanda</li>
                    <li>Generación de stock no vendido</li>
                    <li>Uso intensivo de materiales difíciles de reciclar</li>
                </ul>
                <p>Esto genera ineficiencias estructurales más que puntuales.</p>
                
                <h3>Aportación de la fabricación aditiva</h3>
                <p>La impresión 3D permite producir únicamente lo necesario, cuando es necesario. Esto cambia el modelo de:</p>
                <p><strong>producción → almacenamiento → venta</strong><br/>
                a:<br/>
                <strong>diseño → fabricación bajo demanda → uso</strong></p>
                
                <p>Además:</p>
                <ul>
                    <li>Se reduce el desperdicio de material</li>
                    <li>Se eliminan fases intermedias</li>
                    <li>Se facilita la reutilización de residuos en algunos polímeros</li>
                </ul>
                
                <h3>Limitaciones</h3>
                <ul>
                    <li>No todos los materiales son reciclables en condiciones industriales reales.</li>
                    <li>El consumo energético depende de la tecnología y escala.</li>
                    <li>El impacto global debe evaluarse caso a caso.</li>
                </ul>
                
                <p>Organismos como la European Environment Agency han señalado que la sostenibilidad en fabricación depende más del sistema completo que de una tecnología aislada.<br/>
                <a href="https://www.eea.europa.eu" target="_blank" rel="noopener noreferrer">https://www.eea.europa.eu</a></p>
                
                <h3>Conclusión</h3>
                <p>La fabricación aditiva no es una solución universal, pero sí una herramienta relevante para reducir ciertas ineficiencias estructurales del sector.</p>
            </>
        )
    },
    'disenos-convencional': {
        title: 'Diseños que desafían lo convencional',
        image: genesisCollection,
        content: (
            <>
                <h3>Introducción</h3>
                <p>El diseño de calzado ha estado históricamente condicionado por las limitaciones de fabricación. Con la llegada de herramientas digitales avanzadas, este condicionante comienza a reducirse.</p>
                
                <h3>Cambio de paradigma</h3>
                <p>El uso de modelado 3D y diseño paramétrico permite:</p>
                <ul>
                    <li>Generar geometrías complejas no fabricables con métodos tradicionales</li>
                    <li>Adaptar el diseño a variables específicas como peso, pisada o uso</li>
                    <li>Iterar rápidamente sin costes asociados a moldes o tooling</li>
                </ul>
                
                <h3>Aplicación en Lexxis</h3>
                <p>Los primeros modelos desarrollados dentro de Lexxis exploran:</p>
                <ul>
                    <li>Estructuras internas optimizadas (lattices)</li>
                    <li>Integración funcional de diseño y amortiguación</li>
                    <li>Reducción de componentes ensamblados</li>
                </ul>
                <p>Esto no implica necesariamente mejores productos en todos los casos, pero sí abre nuevas posibilidades de diseño que antes no eran viables.</p>
                
                <h3>Relación con el usuario</h3>
                <p>Uno de los vectores más relevantes es la personalización:</p>
                <ul>
                    <li>Ajuste por talla real, más allá de estándares tradicionales</li>
                    <li>Adaptación a necesidades específicas del usuario</li>
                    <li>Posibilidad de evolución del producto en el tiempo</li>
                </ul>
                <p>Empresas como Adidas han explorado líneas similares con proyectos como Futurecraft, aunque con enfoques industriales distintos.<br/>
                <a href="https://www.adidas.com/futurecraft" target="_blank" rel="noopener noreferrer">https://www.adidas.com/futurecraft</a></p>
                
                <h3>Conclusión</h3>
                <p>El valor no está únicamente en la forma final del producto, sino en la capacidad de modificarlo de manera controlada, reproducible y adaptada a cada caso.</p>
            </>
        )
    }
};

export default function NewsDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const article = NEWS_CONTENT[slug];

    if (!article) {
        return (
            <div className={styles.pageWrapper}>
                <Navbar />
                <main className={styles.mainContent}>
                    <div className={styles.container}>
                        <h2>Noticia no encontrada</h2>
                        <button className={styles.backButton} onClick={() => navigate('/news')}>
                            Volver a actualidad
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <main className={styles.mainContent}>
                <article className={styles.container}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>{article.title}</h1>
                    </header>
                    <div className={styles.imageWrapper}>
                        <img src={article.image} alt={article.title} className={styles.heroImage} />
                    </div>
                    <div className={styles.articleBody}>
                        {article.content}
                    </div>
                    <div className={styles.footer}>
                        <button className={styles.backButton} onClick={() => navigate('/news')}>
                            Volver a actualidad
                        </button>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
