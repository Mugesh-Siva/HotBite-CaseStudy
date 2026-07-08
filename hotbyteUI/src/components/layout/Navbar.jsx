// Navbar - uses AuthContext for auth state and React Router for navigation
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="HotByte Logo" className="navbar-logo" style={{ height: '90px', marginRight: '10px' }} />
          <span className="brand-hot">Hot</span><span className="brand-byte">Byte</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/menu" className="nav-link" onClick={() => setMenuOpen(false)}>Menu</Link>

          {isAuthenticated ? (
            <>
              {/* Role-based links */}
              {user?.roleName === 'RESTAURANT_OWNER' && (
                <Link to="/restaurant-dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              {user?.roleName === 'ADMIN' && (
                <Link to="/admin-dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              {(user?.roleName === 'CUSTOMER' || user?.roleName === 'CUSTOMER_USER') && (
                <>
                  <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
                    Cart
                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                  </Link>
                </>
              )}

              {/* User greeting + Logout */}
              <div className="user-info">
                <span className="user-name">Hi, {user?.fullName?.split(' ')[0]}</span>
                <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-btn-register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
