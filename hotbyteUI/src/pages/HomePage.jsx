import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllRestaurants } from '../api/restaurantApi';
import { getAllMenuItems } from '../api/menuApi';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Pizza', emoji: '' },
  { name: 'Burgers', emoji: '' },
  { name: 'Sushi', emoji: '' },
  { name: 'Vegan', emoji: '' },
  { name: 'Desserts', emoji: '' },
  { name: 'Breakfast', emoji: '' },
];

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllRestaurants()
      .then(res => setRestaurants(res.data.slice(0, 4)))
      .catch(() => {});

    getAllMenuItems()
      .then(res => setFeaturedItems(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious Food,<br />
            <span className="hero-highlight">Delivered to You</span>
          </h1>
          <p className="hero-subtitle">
            Order from your favorite restaurants and get fresh food delivered to your doorstep in 30 minutes.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary-lg">Browse Menu</Link>
            <Link to="/register" className="btn-secondary-lg">Join Free</Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat">
              <span className="stat-num">50K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="stat">
              <span className="stat-num">30 min</span>
              <span className="stat-label">Avg Delivery</span>
            </div>
          </div>
        </div>

      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">What are you craving today?</p>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/menu?category=${cat.name}`)}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {restaurants.length > 0 && (
        <section className="section section-dark">
          <div className="container">
            <h2 className="section-title">Popular Restaurants</h2>
            <p className="section-subtitle">Top-rated places near you</p>
            <div className="restaurants-grid">
              {restaurants.map(r => (
                <div key={r.restaurantId} className="restaurant-card">
                  <div className="restaurant-img-placeholder">
                    Image
                  </div>
                  <div className="restaurant-info">
                    <h3>{r.restaurantName}</h3>
                    <p className="restaurant-contact">Contact: {r.contactNumber}</p>
                    <span className="restaurant-badge">
                      {r.isActive ? 'Open' : 'Closed'}
                    </span>
                    <Link to="/menu" className="restaurant-order-btn">Order Now</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Menu Items */}
      {featuredItems.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Featured Items</h2>
            <p className="section-subtitle">Handpicked by our food experts</p>
            <div className="featured-grid">
              {featuredItems.map(item => (
                <div key={item.menuItemId} className="featured-card">
                  <div className="featured-img">
                    {item.dietaryInfo === 'Vegan' ? 'Vegan' : item.dietaryInfo === 'Vegetarian' ? 'Veg' : 'Non-Veg'}
                  </div>
                  <div className="featured-info">
                    <h4>{item.itemName}</h4>
                    <p className="featured-desc">{item.description?.substring(0, 60)}...</p>
                    <div className="featured-footer">
                      <span className="featured-price">
                        {item.discountPrice
                          ? <><s className="old-price">₹{item.price}</s> ₹{item.discountPrice}</>
                          : `₹${item.price}`}
                      </span>
                      <Link to="/menu" className="featured-btn">Add to Cart</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Get started today and enjoy your first delivery!</p>
          <Link to="/menu" className="btn-primary-lg">Order Now</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
