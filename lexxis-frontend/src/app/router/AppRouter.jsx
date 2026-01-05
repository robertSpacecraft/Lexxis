import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/public/PublicLayout";
import AuthLayout from "../layouts/public/AuthLayout";
import AppLayout from "../layouts/private/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/public/HomePage";
import NotFoundPage from "../pages/public/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AccountHomePage from "../pages/private/AccountHomePage";
import ProductsPage from "../pages/public/ProductsPage";
import PrintsPage from "../pages/public/PrintsPage";

export function AppRouter() {
    return (
        <Routes>
            {/*Rutas públicas */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/prints" element={<PrintsPage />} />

            </Route>

            {/*Rutas para la utenticación y el registro */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/*Rutas privadas */}
            <Route element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/account" element={<AccountHomePage />} />
            </Route>
            
            {/*Si la ruta no está definida */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
