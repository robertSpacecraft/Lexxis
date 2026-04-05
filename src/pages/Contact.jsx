import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './Contact.module.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact Form Submitted:', formData);
        setIsSubmitted(true);
        // Reseteamos el formulario después de un tiempo (opcional)
    };

    return (
        <div className={styles.contactPageWrapper}>
            <Navbar />
            
            <main className={styles.mainBody}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <h1>Contacto</h1>
                        <h2>Estamos aquí para ayudarte</h2>
                    </header>

                    <div className={styles.contentGrid}>
                        {/* Columna Izquierda: Formulario */}
                        <div className={styles.formColumn}>
                            {isSubmitted ? (
                                <div className={styles.successMessage}>
                                    <h3>¡Mensaje enviado con éxito!</h3>
                                    <p>Gracias por contactar con Lexxis. Nos pondremos en contacto contigo en las próximas 24-48 horas laborables.</p>
                                    <button 
                                        className={styles.submitBtn} 
                                        onClick={() => setIsSubmitted(false)}
                                        style={{ marginTop: 'var(--spacing-lg)' }}
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form className={styles.contactForm} onSubmit={handleSubmit}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Nombre completo</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            placeholder="Tu nombre"
                                            className={styles.inputField} 
                                            required 
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            placeholder="tu@email.com"
                                            className={styles.inputField} 
                                            required 
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="subject">Asunto</label>
                                        <input 
                                            type="text" 
                                            id="subject" 
                                            name="subject" 
                                            placeholder="¿En qué podemos ayudarte?"
                                            className={styles.inputField} 
                                            required 
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="message">Mensaje</label>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            placeholder="Escribe aquí tu consulta..."
                                            className={styles.textareaField} 
                                            required 
                                            value={formData.message}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className={styles.submitBtn}>
                                        Enviar mensaje
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Columna Derecha: Información */}
                        <div className={styles.infoColumn}>
                            <div className={styles.infoCard}>
                                <div className={styles.infoItem}>
                                    <div className={styles.iconWrapper}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div className={styles.infoText}>
                                        <h4>Dirección</h4>
                                        <p>Camino Cenia, 10, 03640 Monóvar, Alicante</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.iconWrapper}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div className={styles.infoText}>
                                        <h4>Email</h4>
                                        <p>info@lexxis.es</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.iconWrapper}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div className={styles.infoText}>
                                        <h4>Teléfono</h4>
                                        <p>+34 965 47 0000</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.iconWrapper}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div className={styles.infoText}>
                                        <h4>Horario de atención</h4>
                                        <p>Lunes a Viernes: 9:00 - 18:00</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.mapWrapper}>
                                <iframe 
                                    className={styles.googleMap}
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3128.513!2d-0.8428!3d38.441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd63dc!2sCamino%20Cenia%2C%2010%2C%2003640%20Mon%C3%B3var%2C%20Alicante!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses" 
                                    allowFullScreen="" 
                                    loading="lazy"
                                    title="Lexxis Ubicación"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
