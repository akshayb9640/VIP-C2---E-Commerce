import React, { useState, useEffect } from 'react';
import { useApp } from '../App';

export default function AdminOrders() {
  const { token } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        const statuses = {};
        data.forEach(order => {
          statuses[order._id] = order.orderStatus;
        });
        setSelectedStatuses(statuses);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    }
  }, [token]);

  const handleStatusChange = (id, value) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [id]: value
    });
  };

  const handleUpdateStatus = async (id) => {
    const newStatus = selectedStatuses[id];
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        alert('Order status updated successfully!');
        fetchAllOrders();
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this order?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Order cancelled and deleted successfully!');
        fetchAllOrders();
      } else {
        alert('Failed to cancel order.');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  if (loading) {
    return <div className="admin-container"><div className="text-center mt-4">Loading orders...</div></div>;
  }

  return (
    <div className="admin-container">
      <h2 className="section-title" style={{ color: '#f8fafc' }}>All Customer Orders</h2>
      
      {orders.length === 0 ? (
        <div className="empty-state" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
          <p>No orders placed by customers yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const unitPrice = Math.round(order.price - (order.price * order.discount / 100));
            const totalItemPrice = unitPrice * (order.quantity || 1);

            return (
              <div key={order._id} className="admin-order-card">
                <img 
                  src={order.mainImg} 
                  alt={order.title} 
                  className="order-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop';
                  }}
                />
                <div className="order-details-grid" style={{ color: '#94a3b8' }}>
                  <h3 className="order-title" style={{ color: '#f8fafc' }}>{order.title}</h3>
                  <p className="order-desc-snippet">{order.description}</p>
                  
                  <div className="order-meta-item">Size: <span style={{ color: '#e2e8f0' }}>{order.size}</span></div>
                  <div className="order-meta-item">Quantity: <span style={{ color: '#e2e8f0' }}>{order.quantity}</span></div>
                  <div className="order-meta-item">Price: <span style={{ color: '#e2e8f0' }}>₹ {totalItemPrice}</span></div>
                  <div className="order-meta-item">Payment method: <span style={{ color: '#e2e8f0' }}>{order.paymentMethod}</span></div>
                  
                  <div className="order-meta-item" style={{ gridColumn: 'span 2' }}>
                    UserId: <span style={{ color: '#e2e8f0' }}>{order.userId}</span> &nbsp;|&nbsp; 
                    Name: <span style={{ color: '#e2e8f0' }}>{order.name}</span> &nbsp;|&nbsp; 
                    Email: <span style={{ color: '#e2e8f0' }}>{order.email}</span> &nbsp;|&nbsp; 
                    Mobile: <span style={{ color: '#e2e8f0' }}>{order.mobile}</span>
                  </div>

                  <div className="order-meta-item" style={{ gridColumn: 'span 2' }}>
                    Ordered on: <span style={{ color: '#e2e8f0' }}>{order.orderDate}</span> &nbsp;|&nbsp; 
                    Address: <span style={{ color: '#e2e8f0' }}>{order.address}</span> &nbsp;|&nbsp; 
                    Pincode: <span style={{ color: '#e2e8f0' }}>{order.pincode}</span>
                  </div>

                  <div className="order-meta-item" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', marginTop: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>Order status: <strong className="order-status-badge">{order.orderStatus}</strong></span>
                    <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                      <select
                        className="admin-select"
                        value={selectedStatuses[order._id] || order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="order placed">order placed</option>
                        <option value="In-transit">In-transit</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                      <button 
                        className="btn-admin-submit-blue" 
                        style={{ padding: '0.35rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => handleUpdateStatus(order._id)}
                      >
                        Update
                      </button>
                    </div>
                    <button 
                      className="btn-cancel-order" 
                      style={{ marginLeft: '1rem', padding: '0.35rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
