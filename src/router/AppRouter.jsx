import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import About from '../pages/About';
import News from '../pages/News';
import Contact from '../pages/Contact';
import CatalogProducts from '../pages/CatalogProducts';
import CatalogProductDetail from '../pages/CatalogProductDetail';
import CatalogVariants from '../pages/CatalogVariants';
import CatalogVariantDetail from '../pages/CatalogVariantDetail';
import ProductConfigurator from '../pages/ProductConfigurator';
import ProtectedRoute from '../components/ProtectedRoute';

import AccountLayout from '../pages/account/AccountLayout';
import Profile from '../pages/account/Profile';
import MyDesigns from '../pages/account/MyDesigns';
import Cart from '../pages/account/Cart';
import PrintFiles from '../pages/PrintFiles';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/catalog" element={<CatalogProducts />} />
            <Route path="/catalog/products/:productId" element={<CatalogProductDetail />} />
            <Route path="/catalog/products/:productId/variants" element={<CatalogVariants />} />
            <Route path="/catalog/products/:productId/variants/:variantId" element={<CatalogVariantDetail />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/catalog/products/:productId/design" element={<ProductConfigurator />} />
                
                {/* Account Dashboard */}
                <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<Profile />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="designs" element={<MyDesigns />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="printfiles" element={<PrintFiles />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
}
