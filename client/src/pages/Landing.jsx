import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_IMAGES = {
  'Fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop',
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&auto=format&fit=crop',
  'Mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop',
  'Groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop',
  'Sports-Equipment': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop',
  'Sports Equipments': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop'
};

export default function Landing() {
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  if (!settings) {
    return (
      <div className="home-container">
        <div className="text-center mt-4">Loading ShopEZ...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Banner */}
      <div className="hero-banner">
        <img
          src={settings.banner}
          alt="Super Sale Banner"
          className="banner-img"
          onError={(e) => {
            e.target.src = '/shopez-banner.jpg';
          }}
        />
        <div className="banner-overlay">
          <button className="btn-buy-now" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-container">
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid">
          {settings.categories.map((cat, idx) => (
            <div
              key={idx}
              className="category-card"
              onClick={() => handleCategoryClick(cat)}
            >
              <img
                src={CATEGORY_IMAGES[cat] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop'}
                alt={cat}
                className="category-img"
              />
              <div className="category-name">{cat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
