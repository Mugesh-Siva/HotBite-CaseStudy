import React from 'react';
import Button from '../ui/Button';
import './MenuCard.css';

const MenuCard = ({ item, onAddToCart }) => {
  return (
    <div className="menu-card">
      <div className="menu-image-container">
        <img src={item.imageUrl || 'https://via.placeholder.com/300x200?text=Food+Image'} alt={item.name} className="menu-image" />
        {item.isVeg !== undefined && (
          <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        )}
      </div>
      <div className="menu-content">
        <div className="menu-header">
          <h3 className="menu-title">{item.name}</h3>
          <span className="menu-price">${item.price.toFixed(2)}</span>
        </div>
        <p className="menu-description">{item.description}</p>
        <div className="menu-tags">
          {item.category && <span className="menu-tag">{item.category}</span>}
          {item.tasteInfo && <span className="menu-tag taste">{item.tasteInfo}</span>}
        </div>
        <div className="menu-footer">
          <Button variant="primary" onClick={() => onAddToCart(item)} className="add-to-cart-btn">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
