// Footer component
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="brand-hot">Hot</span><span className="brand-byte">Byte</span>
          <p>Fast, fresh, and always delicious. Your favorite food, delivered.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 HotByte. Built with React + Spring Boot | Hexaware Technologies</p>
      </div>
    </footer>
  );
};

export default Footer;
