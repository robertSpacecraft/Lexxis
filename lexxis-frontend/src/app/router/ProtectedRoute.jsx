import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/useAuth.js";


export default function ProtectedRoute({ children }) {
    const { user, isBootstrapping } = useAuth();
    const location = useLocation();

    if (isBootstrapping) {
        return <div style={{ padding: 24 }}>Cargando sesión...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}
