import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

export default function AdminProducts() {
  const { token } = useApp();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState('Popular');
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/settings')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    let url = 'http://localhost:8000/api/products?';
    
    const params = [];
    if (sortBy) params.push(`sortBy=${encodeURIComponent(sortBy)}`);
    if (selectedCats.length > 0) params.push(`category=${encodeURIComponent(selectedCats.join(','))}`);
    if (selectedGenders.length > 0) params.push(`gender=${encodeURIComponent(selectedGenders.join(','))}`);

    url += params.join('&');

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortBy, selectedCats, selectedGenders]);

  const handleCategoryChange = (cat) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleGenderChange = (gender) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Product deleted successfully!');
        fetchProducts();
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
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
                  style={{ accentColor: '#f97316' }}
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
                  style={{ accentColor: '#f97316' }}
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
                  style={{ accentColor: '#f97316' }}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <main className="products-content">
        <h2 className="section-title">Manage Products</h2>

        {loading ? (
          <div className="text-center mt-4" style={{ color: '#94a3b8' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found.</p>
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
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button 
                        className="btn-admin-submit-blue"
                        style={{ margin: 0, flex: 1, padding: '0.4rem 0' }}
                        onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                      >
                        Update
                      </button>
                      <button 
                        className="btn-admin-submit"
                        style={{ margin: 0, flex: 1, padding: '0.4rem 0', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
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
