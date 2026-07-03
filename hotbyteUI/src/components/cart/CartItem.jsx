import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={item.imageUrl || 'https://via.placeholder.com/80?text=Food'} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-control">
          <button 
            className="quantity-btn" 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >-</button>
          <span className="quantity-display">{item.quantity}</span>
          <button 
            className="quantity-btn" 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >+</button>
        </div>
        <button className="remove-btn" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
      <div className="cart-item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;
