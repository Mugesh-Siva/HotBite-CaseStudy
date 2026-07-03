import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="category-filter-container">
      <div className="category-scroll">
        <button 
          className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => onSelectCategory('All')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
