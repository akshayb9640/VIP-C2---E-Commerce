import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';

export default function Products() {
  const { searchQuery } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [sortBy, setSortBy] = useState('Popular');
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  // Initialize filters from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Category pre-selection
    const catParam = params.get('category');
    if (catParam) {
      setSelectedCats(catParam.split(','));
    } else {
      setSelectedCats([]);
    }

    // Gender pre-selection
    const genderParam = params.get('gender');
    if (genderParam) {
      setSelectedGenders(genderParam.split(','));
    } else {
      setSelectedGenders([]);
    }
  }, [location.search]);

  // Fetch Categories from admin settings
  useEffect(() => {
    fetch('http://localhost:8000/api/settings')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch Products based on filters and global search query
  useEffect(() => {
    setLoading(true);
    let url = 'http://localhost:8000/api/products?';
    
    const params = [];
    if (sortBy) params.push(`sortBy=${encodeURIComponent(sortBy)}`);
    if (selectedCats.length > 0) params.push(`category=${encodeURIComponent(selectedCats.join(','))}`);
    if (selectedGenders.length > 0) params.push(`gender=${encodeURIComponent(selectedGenders.join(','))}`);
    if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);

    url += params.join('&');

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [sortBy, selectedCats, selectedGenders, searchQuery]);

  const handleCategoryChange = (cat) => {
    let updatedCats = [...selectedCats];
    if (updatedCats.includes(cat)) {
      updatedCats = updatedCats.filter(c => c !== cat);
    } else {
      updatedCats.push(cat);
    }
    setSelectedCats(updatedCats);

    // Sync back to URL
    const params = new URLSearchParams(location.search);
    if (updatedCats.length > 0) {
      params.set('category', updatedCats.join(','));
    } else {
      params.delete('category');
    }
    navigate(`/products?${params.toString()}`, { replace: true });
  };

  const handleGenderChange = (gender) => {
    let updatedGenders = [...selectedGenders];
    if (updatedGenders.includes(gender)) {
      updatedGenders = updatedGenders.filter(g => g !== gender);
    } else {
      updatedGenders.push(gender);
    }
    setSelectedGenders(updatedGenders);

    // Sync back to URL
    const params = new URLSearchParams(location.search);
    if (updatedGenders.length > 0) {
      params.set('gender', updatedGenders.join(','));
    } else {
      params.delete('gender');
    }
    navigate(`/products?${params.toString()}`, { replace: true });
  };

  return (
    <div className="catalog-container">
      {/* Sidebar Filters */}
      <aside className="filters-sidebar">
        {/* Sort By */}
        <div className="filter-section">
          <h3 className="filter-title">Sort By</h3>
          <div className="filter-group">
            {['Popular', 'Price (low to high)', 'Price (high to low)', 'Discount'].map((sortOption) => (
              <label key={sortOption} className="filter-label">
                <input 
                  type="radio" 
                  name="sortBy" 
                  checked={sortBy === sortOption}
                  onChange={() => setSortBy(sortOption)}
                />
                <span>{sortOption}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="filter-section">
          <h3 className="filter-title">Categories</h3>
          <div className="filter-group">
            {categories.map((cat) => (
              <label key={cat} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedCats.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="filter-section">
          <h3 className="filter-title">Gender</h3>
          <div className="filter-group">
            {['Men', 'Women', 'Unisex'].map((gender) => (
              <label key={gender} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedGenders.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Products Display List */}
      <main className="products-content">
        <h2 className="section-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h2>

        {loading ? (
          <div className="text-center mt-4">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              const currentPrice = Math.round(product.price - (product.price * product.discount / 100));
              return (
                <div key={product._id} className="product-card">
                  <div className="product-img-wrapper">
                    <img 
                      src={product.mainImg} 
                      alt={product.title} 
                      className="product-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-price-row">
                      <span className="price-current">₹ {currentPrice}</span>
                      {product.discount > 0 && (
                        <>
                          <span className="price-original">₹ {product.price}</span>
                          <span className="price-discount">({product.discount}% off)</span>
                        </>
                      )}
                    </div>
                    <button 
                      className="shop-now-btn"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
