import { Navigate, Outlet } from 'react-router-dom';
import { authStorage } from '../store/authStorage';

export default function ProtectedRoute() {
    const token = authStorage.getToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
