import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../store/authStorage';

export default function ProtectedRoute() {
    const token = authStorage.getToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}
