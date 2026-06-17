import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

export default function Checkout() {
  const { token, fetchCartCount } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('netbanking');

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        if (data.length === 0) {
          navigate('/cart');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cart:', err);
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setSubmitting(true);

    try {
      const orderRes = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          address,
          pincode,
          paymentMethod,
          items: cartItems
        })
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        alert(errData.message || 'Failed to place order.');
        setSubmitting(false);
        return;
      }

      await fetch('http://localhost:8000/api/cart', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      await fetchCartCount();

      alert('Order placed successfully!');
      navigate('/profile');
    } catch (err) {
      alert('Connection error. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="checkout-container"><div className="text-center mt-4">Loading checkout details...</div></div>;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2 className="auth-title">Shipping Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input 
              type="tel" 
              className="form-input" 
              required 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Shipping Address</label>
            <textarea 
              className="form-input" 
              rows="3"
              required 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select 
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="netbanking">Netbanking</option>
              <option value="upi">UPI</option>
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Placing Order...' : 'Confirm Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
