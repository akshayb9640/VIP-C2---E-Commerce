import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

export default function Profile() {
  const { user, token, logout } = useApp();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Order cancelled successfully!');
        fetchOrders();
      } else {
        alert('Failed to cancel order.');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="profile-container"><div className="text-center mt-4">Loading profile...</div></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-layout">
        
        {/* Left Profile Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            {user?.username ? user.username[0].toUpperCase() : 'U'}
          </div>
          <div className="profile-detail">
            <span>Username: </span>{user?.username}
          </div>
          <div className="profile-detail">
            <span>Email: </span>{user?.email}
          </div>
          <div className="profile-detail">
            <span>Orders: </span>{orders.length}
          </div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </aside>

        {/* Right Orders List Column */}
        <main className="orders-column">
          <h2 className="section-title">Orders</h2>
          
          {orders.length === 0 ? (
            <div className="empty-state" style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => {
                const unitPrice = Math.round(order.price - (order.price * order.discount / 100));
                const totalItemPrice = unitPrice * (order.quantity || 1);

                return (
                  <div key={order._id} className="order-card">
                    <img 
                      src={order.mainImg} 
                      alt={order.title} 
                      className="order-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop';
                      }}
                    />
                    <div className="order-details-grid">
                      <h3 className="order-title">{order.title}</h3>
                      <p className="order-desc-snippet">{order.description}</p>
                      
                      <div className="order-meta-item">Size: <span>{order.size}</span></div>
                      <div className="order-meta-item">Quantity: <span>{order.quantity}</span></div>
                      <div className="order-meta-item">Price: <span>₹ {totalItemPrice}</span></div>
                      <div className="order-meta-item">Payment method: <span>{order.paymentMethod}</span></div>
                      <div className="order-meta-item">Address: <span>{order.address}</span></div>
                      <div className="order-meta-item">Pincode: <span>{order.pincode}</span></div>
                      <div className="order-meta-item">Ordered on: <span>{order.orderDate}</span></div>
                      <div className="order-meta-item" style={{ gridColumn: 'span 2' }}>
                        Order status: <span className="order-status-badge">{order.orderStatus}</span>
                      </div>
                    </div>
                    
                    <div className="order-actions">
                      {order.orderStatus !== 'delivered' && (
                        <button 
                          className="btn-cancel-order"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
