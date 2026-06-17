import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';

export default function AdminDashboard() {
  const { token } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [metrics, setMetrics] = useState({ totalUsers: 0, allProducts: 0, allOrders: 0 });
  const [bannerUrl, setBannerUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const showUsersList = queryParams.get('view') === 'users';

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const metricsRes = await fetch('http://localhost:8000/api/admin/metrics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }

        const settingsRes = await fetch('http://localhost:8000/api/admin/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setBannerUrl(settingsData.banner);
        }

        if (showUsersList) {
          const usersRes = await fetch('http://localhost:8000/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData);
          }
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, showUsersList]);

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ banner: bannerUrl })
      });
      if (res.ok) {
        alert('Banner updated successfully!');
      } else {
        alert('Failed to update banner.');
      }
    } catch (err) {
      alert('Error updating banner.');
    }
  };

  if (loading) {
    return <div className="admin-container"><div className="text-center mt-4">Loading Admin Panel...</div></div>;
  }

  if (showUsersList) {
    return (
      <div className="admin-container">
        <h2 className="section-title" style={{ color: '#f8fafc' }}>Registered Users</h2>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>User Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.usertype === 'Admin' ? 'badge-admin' : 'badge-customer'}`}>
                      {u.usertype}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total users</h3>
          <div className="metric-val">{metrics.totalUsers}</div>
          <button className="btn-admin-action" onClick={() => navigate('/admin?view=users')}>View all</button>
        </div>
        <div className="metric-card">
          <h3>All Products</h3>
          <div className="metric-val">{metrics.allProducts}</div>
          <button className="btn-admin-action" onClick={() => navigate('/admin/products')}>View all</button>
        </div>
        <div className="metric-card">
          <h3>All Orders</h3>
          <div className="metric-val">{metrics.allOrders}</div>
          <button className="btn-admin-action" onClick={() => navigate('/admin/orders')}>View all</button>
        </div>
        <div className="metric-card">
          <h3>Add Product</h3>
          <div className="metric-val">(new)</div>
          <button className="btn-admin-action" onClick={() => navigate('/admin/new-product')}>Add now</button>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Update banner</h3>
        <form onSubmit={handleUpdateBanner}>
          <input 
            type="text" 
            placeholder="Banner url" 
            className="admin-input"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            required
          />
          <button type="submit" className="btn-admin-submit">Update</button>
        </form>
      </div>
    </div>
  );
}
