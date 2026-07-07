// CartPage - View and manage cart items
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAllMenuItems } from '../api/menuApi';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getAllMenuItems();
        setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to load menu items", err);
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const getMenuItem = (id) => menuItems.find(m => m.menuItemId === id);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const menuItem = getMenuItem(item.menuItemId);
      const itemPrice = item.unitPrice || (menuItem ? (menuItem.discountPrice || menuItem.price) : 0);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const activeSubtotal = calculateSubtotal();
  const deliveryFee = activeSubtotal >= 500 ? 0 : (activeSubtotal > 0 ? 40 : 0);
  const grandTotal = activeSubtotal + deliveryFee;

  if (loading || menuLoading) {
    return (
      <div className="cart-page">
        <div className="loading-text">Loading your cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">Cart</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/menu" className="browse-btn">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <p className="cart-count">{cartItems.length} item(s) in your cart</p>

            {cartItems.map(item => {
              const menuItem = getMenuItem(item.menuItemId);
              const itemPrice = item.unitPrice || (menuItem ? (menuItem.discountPrice || menuItem.price) : 0);
              return (
              <div key={item.cartItemId} className="cart-item-row">
                <div className="cart-item-emoji">
                  {menuItem ? (menuItem.dietaryInfo === 'Vegan' ? 'Vegan' : menuItem.dietaryInfo === 'Vegetarian' ? 'Veg' : 'Non-Veg') : 'Item'}
                </div>
                <div className="cart-item-info">
                  <h4>{menuItem ? menuItem.itemName : `Menu Item #${item.menuItemId}`}</h4>
                  <p className="cart-item-unit">₹{itemPrice} each</p>
                </div>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                  >+</button>
                </div>
                <div className="cart-item-subtotal">
                  ₹{(itemPrice * item.quantity).toFixed(2)}
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.cartItemId)}>
                  Remove
                </button>
              </div>
            )})}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{activeSubtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>Free</span> : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <Link to="/menu" className="continue-link">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
