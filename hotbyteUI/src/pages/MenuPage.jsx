// MenuPage - Browse all menu items with search, category filter, veg/non-veg filter
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllMenuItems, getAllCategories } from '../services/menuService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './MenuPage.css';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) setSelectedCategory(catParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuRes, catRes] = await Promise.all([
          getAllMenuItems(),
          getAllCategories(),
        ]);
        setMenuItems(menuRes.data);
        setCategories(catRes.data);
      } catch (err) {
        toast.error('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtering and sorting (Simplified for Viva explanation)
  const filteredItems = menuItems.filter(item => {
    // 1. Search Filter (Check if name or description includes search text)
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = item.itemName ? item.itemName.toLowerCase().includes(searchLower) : false;
    const descMatch = item.description ? item.description.toLowerCase().includes(searchLower) : false;
    const matchesSearch = searchLower === '' || nameMatch || descMatch;

    // 2. Category Filter (Check if item belongs to the selected category OR its availability time matches)
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      const categoryObj = categories.find(c => String(c.categoryId) === String(item.categoryId));
      const catNameMatches = categoryObj ? (categoryObj.categoryName === selectedCategory) : false;

      // Also check if they typed the category name into the availabilityTime field!
      const timeMatches = item.availabilityTime ?
        item.availabilityTime.toLowerCase().includes(selectedCategory.toLowerCase()) : false;

      matchesCategory = catNameMatches || timeMatches;
    }

    // 3. Dietary Filter (Check if item matches Veg/Non-Veg/etc)
    let matchesDiet = true;
    if (dietaryFilter !== 'All') {
      matchesDiet = item.dietaryInfo ? item.dietaryInfo.toLowerCase() === dietaryFilter.toLowerCase() : false;
    }

    // Item must match all filters and be in stock
    return matchesSearch && matchesCategory && matchesDiet && !item.isOutOfStock;
  }).sort((a, b) => {
    // Sorting logic
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    return 0;
  });

  const handleAddToCart = (item, e = null) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      return;
    }
    addToCart(item);
    toast.success(`${item.itemName} added to cart!`);
  };

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.categoryId === categoryId)?.categoryName || '';
  };

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <h1>Our Menu</h1>
        <p>Fresh ingredients, authentic flavors</p>
      </div>

      <div className="menu-container">
        {/* Filters Bar */}
        <div className="filters-bar">
          {/* Search */}
          <div className="search-wrapper">
            <span className="search-icon">Search</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dietary Filter */}
          <div className="filter-buttons">
            {['All', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Pescatarian'].map(d => (
              <button
                key={d}
                className={`filter-chip ${dietaryFilter === d ? 'active' : ''}`}
                onClick={() => setDietaryFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          <button
            className={`cat-tab ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.categoryId}
              className={`cat-tab ${selectedCategory === cat.categoryName ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.categoryName)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="results-info">
          {!loading && <span>{filteredItems.length} items found</span>}
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <span>No Items</span>
            <h3>No items found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map(item => (
              <div
                key={item.menuItemId}
                className="menu-item-card"
                onClick={() => { setSelectedItem(item); setCurrentImageIndex(0); }}
                style={{ cursor: 'pointer' }}
              >
                <div className="menu-item-img">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`http://localhost:8080${item.images[0].imageUrl}`}
                      alt={item.itemName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="placeholder-img">No Image</div>
                  )}
                  <span className={`diet-badge ${item.dietaryInfo === 'Vegetarian' || item.dietaryInfo === 'Vegan' ? 'veg' : 'non-veg'}`}>
                    {item.dietaryInfo === 'Vegetarian' || item.dietaryInfo === 'Vegan' ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>
                <div className="menu-item-body">
                  <div className="menu-item-top">
                    <h3 className="menu-item-name">{item.itemName}</h3>
                    <div className="menu-item-price">
                      {item.discountPrice ? (
                        <>
                          <span className="price-current">₹{item.discountPrice}</span>
                          <span className="price-original">₹{item.price}</span>
                        </>
                      ) : (
                        <span className="price-current">₹{item.price}</span>
                      )}
                    </div>
                  </div>
                  <p className="menu-item-desc">{item.description}</p>
                  <div className="menu-item-tags">
                    {getCategoryName(item.categoryId) && (
                      <span className="tag">{getCategoryName(item.categoryId)}</span>
                    )}
                    {item.tasteInfo && <span className="tag taste">{item.tasteInfo}</span>}
                    {item.availabilityTime && <span className="tag">{item.availabilityTime}</span>}
                  </div>
                  {item.nutritionalInfo && (
                    <p className="menu-item-nutrition">Nutrition: {item.nutritionalInfo}</p>
                  )}
                  <button
                    className="add-cart-btn"
                    onClick={(e) => handleAddToCart(item, e)}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Item Modal */}
      {selectedItem && (
        <div className="item-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="item-modal-content" onClick={e => e.stopPropagation()}>
            <button className="item-modal-close" onClick={() => setSelectedItem(null)}>×</button>
            <div className="item-modal-left">
              {selectedItem.images && selectedItem.images.length > 0 ? (
                <div className="modal-gallery">
                  <img
                    src={`http://localhost:8080${selectedItem.images[currentImageIndex].imageUrl}`}
                    alt={selectedItem.itemName}
                    className="item-modal-img"
                  />
                  {selectedItem.images.length > 1 && (
                    <div className="gallery-thumbnails">
                      {selectedItem.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:8080${img.imageUrl}`}
                          alt="thumbnail"
                          className={`thumbnail ${currentImageIndex === idx ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="placeholder-img-large">No Image Available</div>
              )}
            </div>
            <div className="item-modal-right">
              <div className="item-modal-header">
                <h2 className="item-modal-name">{selectedItem.itemName}</h2>
                <div className="item-modal-price">
                  {selectedItem.discountPrice ? (
                    <>
                      <span>₹{selectedItem.discountPrice}</span>
                      <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '14px', marginLeft: '8px' }}>₹{selectedItem.price}</span>
                    </>
                  ) : (
                    <span>₹{selectedItem.price}</span>
                  )}
                </div>
                <div className="menu-item-tags">
                  <span className={`diet-badge ${selectedItem.dietaryInfo === 'Vegetarian' || selectedItem.dietaryInfo === 'Vegan' ? 'veg' : 'non-veg'}`} style={{ position: 'static', boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                    {selectedItem.dietaryInfo === 'Vegetarian' || selectedItem.dietaryInfo === 'Vegan' ? 'Veg' : 'Non-Veg'}
                  </span>
                  {getCategoryName(selectedItem.categoryId) && <span className="tag">{getCategoryName(selectedItem.categoryId)}</span>}
                  {selectedItem.tasteInfo && <span className="tag taste">{selectedItem.tasteInfo}</span>}
                </div>
              </div>

              <p className="item-modal-desc">{selectedItem.description || 'No description available for this delicious item.'}</p>

              {selectedItem.nutritionalInfo && (
                <div className="item-modal-nutrition">
                  <h4>Nutritional Information</h4>
                  <p>{selectedItem.nutritionalInfo}</p>
                </div>
              )}

              <div className="item-modal-actions">
                <button
                  className="add-cart-btn"
                  onClick={() => {
                    handleAddToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                  style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '16px', padding: '15px' }}
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
