import { useState, useEffect } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Comprobar si hay una preferencia guardada
        const savedTheme = localStorage.getItem('lexxis_theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Si no la hay, comprobar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        // Aplicar el tema al root document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lexxis_theme', theme);
    }, [theme]);

    // Escuchar cambios en el sistema operativo si no hay preferencia manual estricta
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            const savedTheme = localStorage.getItem('lexxis_theme');
            // Si no hay localStorage manual, actualizamos automático
            if (!savedTheme) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
}
