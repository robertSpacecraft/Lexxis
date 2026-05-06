import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook para manejar peticiones asíncronas de forma estandarizada.
 * 
 * @param {Function} asyncFunction - La función asíncrona a ejecutar.
 * @param {boolean|Object} optionsOrImmediate - Opciones (objeto) o flag immediate (boolean).
 * @returns {Object} - { execute, refetch, status, data, error, loading }
 */
export function useAsync(asyncFunction, optionsOrImmediate = true) {
    const defaultOptions = { immediate: true, errorMessage: null };
    let resolvedOptions = { ...defaultOptions };

    if (typeof optionsOrImmediate === 'boolean') {
        resolvedOptions.immediate = optionsOrImmediate;
    } else if (typeof optionsOrImmediate === 'object' && optionsOrImmediate !== null) {
        resolvedOptions = { ...defaultOptions, ...optionsOrImmediate };
    }

    const { immediate, errorMessage } = resolvedOptions;

    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    // Ref para controlar si el componente sigue montado
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const execute = useCallback(async (...args) => {
        if (!isMounted.current) return;
        
        setStatus('pending');
        setData(null);
        setError(null);
        
        try {
            const response = await asyncFunction(...args);
            if (isMounted.current) {
                setData(response);
                setStatus('success');
            }
            return response;
        } catch (err) {
            if (isMounted.current) {
                const safeErrorMessage = errorMessage || err.message || 'Ha ocurrido un error inesperado';
                setError(safeErrorMessage);
                setStatus('error');
            }
            throw err;
        }
    }, [asyncFunction, errorMessage]);

    useEffect(() => {
        if (immediate) {
            execute().catch(() => {
                // Silenciar el error aquí porque ya se maneja en el estado 'error'
            });
        }
    }, [execute, immediate]);

    return {
        execute,
        refetch: execute,
        status,
        data,
        error,
        loading: status === 'pending' || (immediate && status === 'idle')
    };
}
