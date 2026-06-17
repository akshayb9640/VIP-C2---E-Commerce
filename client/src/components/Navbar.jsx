import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';

export default function Navbar() {
  const { user, logout, cartCount, searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate(`/products?search=${encodeURIComponent(localSearch)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user && user.usertype === 'Admin';

  if (isAdmin) {
    return (
      <nav className="navbar admin-navbar">
        <Link to="/admin" className="nav-logo">
          ShopEZ (admin)
        </Link>
        <div className="nav-links admin-nav-links">
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Home</Link>
          <Link to="/admin?view=users" className={location.pathname === '/admin' && new URLSearchParams(location.search).get('view') === 'users' ? 'active' : ''}>Users</Link>
          <Link to="/admin/orders" className={location.pathname === '/admin/orders' ? 'active' : ''}>Orders</Link>
          <Link to="/admin/products" className={location.pathname === '/admin/products' ? 'active' : ''}>Products</Link>
          <Link to="/admin/new-product" className={location.pathname === '/admin/new-product' ? 'active' : ''}>New Product</Link>
          <a href="#" onClick={handleLogout} className="logout-link">Logout</a>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" onClick={() => { setSearchQuery(''); setLocalSearch(''); }}>
        ShopEZ
      </Link>
      
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <input 
          type="text" 
          placeholder="Search Electronics, Fashion, mobiles, etc..." 
          className="search-input"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      <div className="nav-links">
        {user ? (
          <>
            <div className="nav-user-info" onClick={() => navigate('/profile')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{user.username}</span>
            </div>
            
            <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </>
        ) : (
          <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
}
