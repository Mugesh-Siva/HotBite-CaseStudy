import React from 'react';
import Button from '../ui/Button';
import './CartSummary.css';

const CartSummary = ({ items, subtotal, discount = 0, deliveryFee = 5 }) => {
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="cart-summary">
      <h3 className="summary-title">Order Summary</h3>
      
      <div className="summary-row">
        <span>Subtotal ({items.length} items)</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      
      {discount > 0 && (
        <div className="summary-row discount">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}
      
      <div className="summary-row">
        <span>Delivery Fee</span>
        <span>${deliveryFee.toFixed(2)}</span>
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-row total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <Button variant="primary" className="checkout-btn" onClick={() => window.location.href = '/checkout'}>
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
