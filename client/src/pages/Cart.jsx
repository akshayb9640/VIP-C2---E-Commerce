import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

export default function Cart() {
  const { token, fetchCartCount } = useApp();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });
      if (res.ok) {
        fetchCart();
        fetchCartCount();
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchCart();
        fetchCartCount();
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (loading) {
    return <div className="cart-container"><div className="text-center mt-4">Loading your cart...</div></div>;
  }

  let totalMRP = 0;
  let totalDiscount = 0;
  
  cartItems.forEach(item => {
    const qty = Number(item.quantity || 1);
    totalMRP += Number(item.price) * qty;
    
    const sellingPrice = Math.round(item.price - (item.price * item.discount / 100));
    totalDiscount += (Number(item.price) - sellingPrice) * qty;
  });

  const finalPrice = totalMRP - totalDiscount;

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2>Your cart is empty!</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Add some products to your cart and make them yours.</p>
          <button className="btn-buy-now" style={{ padding: '0.65rem 2.5rem', display: 'inline-block', width: 'auto' }} onClick={() => navigate('/products')}>Shop Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="section-title">Your Cart ({cartItems.length} items)</h2>
      <div className="cart-layout">
        
        {/* Cart Items Column */}
        <div className="cart-items-column">
          {cartItems.map((item) => {
            const qty = Number(item.quantity || 1);
            const unitSellingPrice = Math.round(item.price - (item.price * item.discount / 100));
            const totalItemPrice = unitSellingPrice * qty;

            return (
              <div key={item._id} className="cart-item-card">
                <img 
                  src={item.mainImg} 
                  alt={item.title} 
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop';
                  }}
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-meta" style={{ fontSize: '0.85rem' }}>{item.description}</p>
                  <div className="cart-item-meta" style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                    <span>Size: <strong>{item.size}</strong></span>
                    <div className="cart-item-qty">
                      <span>Quantity:</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, qty - 1)}>-</button>
                      <span className="qty-val">{qty}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="btn-remove-item" style={{ marginTop: '1rem' }} onClick={() => removeItem(item._id)}>Remove</button>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-price">₹ {totalItemPrice}</span>
                  {item.discount > 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                      (Saved ₹ {Math.round(item.price * item.discount / 100) * qty})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Summary Column */}
        <div className="price-details-card">
          <h3 className="price-details-title">Price Details</h3>
          
          <div className="price-row">
            <span>Total MRP</span>
            <span>₹ {totalMRP}</span>
          </div>
          
          <div className="price-row discount-row">
            <span>Discount on MRP</span>
            <span>- ₹ {totalDiscount}</span>
          </div>
          
          <div className="price-row">
            <span>Delivery Charges</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
          </div>
          
          <div className="price-row total-row">
            <span>Final Price</span>
            <span>₹ {finalPrice}</span>
          </div>

          <button 
            className="btn-place-order"
            onClick={() => navigate('/checkout')}
          >
            Place order
          </button>
        </div>

      </div>
    </div>
  );
}
