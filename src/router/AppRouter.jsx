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
import PrintJobConfig from '../pages/account/PrintJobConfig';
import MyPrintJobs from '../pages/account/MyPrintJobs';
import PrintFileDetail from '../pages/account/PrintFileDetail';
import PrintFileConfigure from '../pages/account/PrintFileConfigure';
import Orders from '../pages/account/Orders';
import OrderDetail from '../pages/account/OrderDetail';
import ServicePrint3D from '../pages/ServicePrint3D';

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
                <Route path="/services/print3d" element={<ServicePrint3D />} />

                {/* Account Dashboard */}
                <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<Profile />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="designs" element={<MyDesigns />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="printfiles" element={<PrintFiles />} />
                    <Route path="printfiles/:printFileId" element={<PrintFileDetail />} />
                    <Route path="printfiles/:printFileId/configure" element={<PrintFileConfigure />} />
                    <Route path="printjobs" element={<MyPrintJobs />} />
                    <Route path="printfiles/:printFileId/jobs/:printJobId" element={<PrintJobConfig />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:orderId" element={<OrderDetail />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
}
