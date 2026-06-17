import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import NewProduct from './pages/NewProduct';

export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('shopez_token');
    const storedUser = localStorage.getItem('shopez_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (token && user && user.usertype === 'Customer') {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [token, user]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const total = data.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
        setCartCount(total);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const loginUser = (userToken, userData) => {
    localStorage.setItem('shopez_token', userToken);
    localStorage.setItem('shopez_user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('shopez_token');
    localStorage.removeItem('shopez_user');
    setToken(null);
    setUser(null);
    setCartCount(0);
  };

  // Set body class for Admin dark theme
  useEffect(() => {
    if (user && user.usertype === 'Admin') {
      document.body.classList.add('admin-body');
    } else {
      document.body.classList.remove('admin-body');
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      user,
      token,
      cartCount,
      searchQuery,
      setSearchQuery,
      login: loginUser,
      logout: logoutUser,
      fetchCartCount
    }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          <Route path="/cart" element={
            token && user?.usertype === 'Customer' ? <Cart /> : <Navigate to="/login" />
          } />
          
          <Route path="/checkout" element={
            token && user?.usertype === 'Customer' ? <Checkout /> : <Navigate to="/login" />
          } />
          
          <Route path="/profile" element={
            token && user?.usertype === 'Customer' ? <Profile /> : <Navigate to="/login" />
          } />

          {/* Auth Routes */}
          <Route path="/login" element={
            !token ? <Login /> : (user?.usertype === 'Admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)
          } />
          <Route path="/register" element={
            !token ? <Register /> : (user?.usertype === 'Admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            token && user?.usertype === 'Admin' ? <AdminDashboard /> : <Navigate to="/login" />
          } />
          <Route path="/admin/orders" element={
            token && user?.usertype === 'Admin' ? <AdminOrders /> : <Navigate to="/login" />
          } />
          <Route path="/admin/products" element={
            token && user?.usertype === 'Admin' ? <AdminProducts /> : <Navigate to="/login" />
          } />
          <Route path="/admin/new-product" element={
            token && user?.usertype === 'Admin' ? <NewProduct /> : <Navigate to="/login" />
          } />
          <Route path="/admin/edit-product/:id" element={
            token && user?.usertype === 'Admin' ? <NewProduct /> : <Navigate to="/login" />
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
