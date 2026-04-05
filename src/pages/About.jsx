import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './About.module.css';

const About = () => {
    return (
        <div className={styles.aboutContainer}>
            <Navbar />
            
            <main className={styles.mainBody}>
                <div className={styles.container}>
                    {/* Hero Section */}
                    <section className={styles.hero}>
                        <span className={styles.slogan}>Innovación a cada paso</span>
                        <h1>Sobre Lexxis</h1>
                        <p>
                            Utilizamos la tecnología 3D para revolucionar el calzado, 
                            fusionando el diseño digital con la fabricación bajo demanda.
                        </p>
                    </section>

                    {/* Historia Section */}
                    <section className={styles.section}>
                        <h2>Nuestra Historia</h2>
                        <div className={styles.historyContent}>
                            <p>
                                Lexxis es una iniciativa tecnológica enfocada en el desarrollo de una plataforma web que fusiona 
                                el diseño digital con la fabricación bajo demanda mediante impresión 3D. 
                            </p>
                            <p>
                                La empresa nace con el objetivo de transformar sectores tradicionales, principalmente el del calzado, 
                                mediante la integración de entornos digitales y producción física de vanguardia.
                            </p>
                        </div>
                    </section>

                    {/* Nuestros Pilares Section */}
                    <section className={styles.section}>
                        <h2>Nuestros Pilares</h2>
                        <div className={styles.pillarsGrid}>
                            {/* Personalización */}
                            <div className={styles.pillarCard}>
                                <div className={styles.iconWrapper}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                        <polyline points="2 17 12 22 22 17" />
                                        <polyline points="2 12 12 17 22 12" />
                                    </svg>
                                </div>
                                <h3>Personalización Total</h3>
                                <p>Definimos un modelo de negocio centrado en que el usuario pueda personalizar su producto de manera única y personal.</p>
                            </div>

                            {/* Innovación Tecnológica */}
                            <div className={styles.pillarCard}>
                                <div className={styles.iconWrapper}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <h3>Innovación Tecnológica</h3>
                                <p>Aplicación de fabricación aditiva (impresión 3D) para optimizar recursos y mejorar la eficiencia operativa en cada paso del proceso.</p>
                            </div>

                            {/* Sostenibilidad */}
                            <div className={styles.pillarCard}>
                                <div className={styles.iconWrapper}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a7 7 0 0 1-9 10z" />
                                        <path d="M7 2a1 1 0 0 1 .1 1.9c-.3.2-.7.4-1 .6a1 1 0 0 1-1-1.7c.3-.2.6-.4.9-.8" />
                                    </svg>
                                </div>
                                <h3>Sostenibilidad</h3>
                                <p>Implementamos un sistema de producción bajo demanda que reduce drásticamente el stock acumulado y minimiza los residuos generados.</p>
                            </div>
                        </div>
                    </section>

                    {/* El Equipo Section */}
                    <section className={styles.section}>
                        <h2>El Equipo</h2>
                        <div className={styles.teamCard}>
                            <div className={styles.teamInfo}>
                                <h4>Roberto Amorós Linares</h4>
                                <p>Promotor principal con un perfil enfocado en el desarrollo tecnológico y la gestión integral del proyecto.</p>
                            </div>
                        </div>
                    </section>

                    {/* Vision Section */}
                    <div className={styles.visionContainer}>
                        <p className={styles.visionQuote}>
                            "Liderar la transformación digital en sectores tradicionales a través de la fabricación inteligente y el diseño centrado en las personas."
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
