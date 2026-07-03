import React from 'react';
import MenuCard from './MenuCard';
import './MenuList.css';

const MenuList = ({ items, onAddToCart }) => {
  if (!items || items.length === 0) {
    return (
      <div className="empty-menu">
        <h3>No menu items found.</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {items.map(item => (
        <MenuCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default MenuList;
