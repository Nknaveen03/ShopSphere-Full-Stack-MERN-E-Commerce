// ============================================================
// App.jsx - Root component with routing
// ============================================================
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';

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

// Guard
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
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

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
