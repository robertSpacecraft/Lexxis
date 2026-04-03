import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.copyright}>
                    &copy; {currentYear} Lexxis Future Footwear
                </p>
            </div>
        </footer>
    );
}
