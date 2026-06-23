import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout
import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';

// Pages
import HomePage       from './pages/HomePage';
import ProductsPage   from './pages/ProductsPage';
import ProductDetail  from './pages/ProductDetailPage';
import CartPage       from './pages/CartPage';
import CheckoutPage   from './pages/CheckoutPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage'; 
import DashboardPage  from './pages/DashboardPage';
import OrderDetailPage from './pages/OrderDetailPage';
import NotFoundPage   from './pages/NotFoundPage';

// Admin Pages
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminOrderList   from './pages/admin/AdminOrderList';
import AdminUserList    from './pages/admin/AdminUserList';

// Guard
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <CartDrawer />
          <main style={{ flex: 1, paddingTop: 'var(--nav-height)' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/"           element={<HomePage />} />
              <Route path="/products"   element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login"      element={<LoginPage />} />
              <Route path="/register"   element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route path="/cart" element={
                <ProtectedRoute><CartPage /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><CheckoutPage /></ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute adminOnly={true}><AdminProductList /></ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute adminOnly={true}><AdminOrderList /></ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly={true}><AdminUserList /></ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
