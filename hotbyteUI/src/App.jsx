// App.jsx - Main application with routing
// All routes are defined here with role-based protection

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import RestaurantDashboardPage from './pages/RestaurantDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminMenusPage from './pages/admin/AdminMenusPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Auth Pages (inside the component files)
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OAuth2Callback from './components/auth/OAuth2Callback';
import ForgotPassword from './components/auth/ForgotPassword';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              background: '#1a1a2e',
              border: '1px solid rgba(255,107,53,0.2)',
              color: '#fff',
            }}
          />

          {/* Layout: Navbar + Page + Footer */}
          <div className="app-wrapper">
            <Navbar />

            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/oauth2/callback" element={<OAuth2Callback />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Restaurant Owner Dashboard */}
                <Route
                  path="/restaurant-dashboard"
                  element={
                    <ProtectedRoute requiredRole="RESTAURANT_OWNER">
                      <RestaurantDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Dashboard */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/restaurants"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminRestaurantsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/menus"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminMenusPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminOrdersPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#fff' }}>
                      <h1 style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
                      <h2>Page Not Found</h2>
                      <a href="/" style={{ color: '#ff6b35', fontSize: '1rem' }}>Go Home</a>
                    </div>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
