import { useTheme } from '../hooks/useTheme';
import styles from './ThemeToggle.module.css';

const SunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.0708 4.9292L17.6566 6.34341M6.34315 17.6569L4.92893 19.0711M19.0708 19.0711L17.6566 17.6569M6.34315 6.34341L4.92893 4.9292" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const MoonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.3542 14.3542C18.0685 15.3862 16.4475 16 14.6986 16C10.446 16 7 12.554 7 8.30137C7 6.55255 7.6138 4.93154 8.64576 3.6458C5.34863 4.43851 2.90561 7.42398 2.90561 10.9772C2.90561 15.2298 6.35164 18.6758 10.6042 18.6758C14.1575 18.6758 17.143 16.2328 17.9357 12.9356C18.4673 13.5422 19.3542 14.3542 19.3542 14.3542Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={styles.toggleWrapper}>
            <button 
                onClick={toggleTheme} 
                className={styles.toggleBtn}
                aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        </div>
    );
}
