import React from 'react';
import './Navbar.css';

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-hot">Hot</span><span className="brand-byte">Byte</span>
        </div>
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/menu" className="nav-link">Menu</a>
          
          {isAuthenticated ? (
            <>
              {userRole === 'RESTAURANT' && <a href="/restaurant-dashboard" className="nav-link">Dashboard</a>}
              {userRole === 'ADMIN' && <a href="/admin-dashboard" className="nav-link">Admin Panel</a>}
              {userRole === 'USER' && (
                <>
                  <a href="/orders" className="nav-link">Orders</a>
                  <a href="/cart" className="nav-link cart-link">
                    Cart <span className="cart-badge">0</span>
                  </a>
                </>
              )}
              <button className="nav-btn-logout" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <div className="auth-buttons">
              <a href="/login" className="nav-link">Login</a>
              <a href="/register" className="nav-btn-register">Sign Up</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
