import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.techLine}></div>
                <p>Creado por Roberto Amorós Linares</p>
                <small className={styles.text}>
                    © {new Date().getFullYear()} LEXXIS — FABRICACIÓN INTELIGENTE 2026
                </small>
            </div>
        </footer>
    );
}
