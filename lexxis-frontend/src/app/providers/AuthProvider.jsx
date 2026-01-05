import { useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { login as apiLogin, me as apiMe, logout as apiLogout } from "../../api/auth.js";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    //Este bloque comprueba si ya hay una sesión activa
    const didBootstrap = useRef(false);

    useEffect(() => {
        if (didBootstrap.current) return;
        didBootstrap.current = true;

        let cancelled = false;

        async function bootstrap() {
            try {
                const res = await apiMe();
                if (!cancelled) setUser(res.data);
            } catch {
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setIsBootstrapping(false);
            }
        }

        bootstrap();

        return () => {
            cancelled = true;
        };
    }, []);

    //Llama al servidor para validar las credenciales, si son correctas pide los datos del usuario y lo guarda en el estado.
    async function login(credentials) {
        await apiLogin(credentials);
        const meRes = await apiMe();
        setUser(meRes.data);
    }

    //Llama al servidor para cerrar la sesión (borrar las cookies) y borra el usuario = null
    async function logout() {
        await apiLogout();
        setUser(null);
    }

    //Evita qeu los componentes que consumen el contexto se rendericen de nuevo innecesariamente
    const value = useMemo(
        () => ({ user, isBootstrapping, login, logout }),
        [user, isBootstrapping]
    );

    //Devuelve todos los componentes hijos con el proveedor del contexto
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
