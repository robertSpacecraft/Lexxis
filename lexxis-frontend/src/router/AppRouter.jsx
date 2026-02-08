import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import CatalogProducts from '../pages/CatalogProducts';
import CatalogProductDetail from '../pages/CatalogProductDetail';
import CatalogVariants from '../pages/CatalogVariants';
import CatalogVariantDetail from '../pages/CatalogVariantDetail';
import PrintFiles from '../pages/PrintFiles';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/catalog" element={<CatalogProducts />} />
            <Route path="/catalog/products/:productId" element={<CatalogProductDetail />} />
            <Route path="/catalog/products/:productId/variants" element={<CatalogVariants />} />
            <Route path="/catalog/products/:productId/variants/:variantId" element={<CatalogVariantDetail />} />

            {/* Protected Routes */}
            <Route path="/account" element={<ProtectedRoute />}>
                <Route path="printfiles" element={<PrintFiles />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
}
