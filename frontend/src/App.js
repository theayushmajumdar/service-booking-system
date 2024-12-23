import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './components/HomePage';
import LoginModal from './components/LoginModal';
import ServiceListPage from './components/ServiceList';
import Navbar from './components/Navbar';
import CartPage from './components/Cart';
import Checkout from './components/Checkout';
import BookServices from './components/BookServices';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartData, setCartData] = useState([]);
  const [userDetails, setUserDetails] = useState({
    username: '',
    phoneNumber: '',
    address: { buildingNumber: '', streetName: '', city: '', postalCode: '' },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:8888/protected', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          navigate('/services');  // Redirect to services page after successful verification
        }
      }
    } catch (error) {
      console.error('Token Verification Error:', error.response || error.message);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('username', username);
    navigate('/services');  // Redirect to services page after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleProceedToCheckout = () => {
    navigate('/bookservices', {
      state: {
        cartItems: cartData,
        totalAmount: calculateTotalAmount(cartData),
        username: userDetails.username,
        phoneNumber: userDetails.phoneNumber,
        address: userDetails.address,
      },
    });
  };

  const calculateTotalAmount = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginModal onLoginSuccess={handleLogin} />} />
        <Route
          path="/services"
          element={isAuthenticated ? <ServiceListPage searchQuery={searchQuery} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <CartPage onProceedToCheckout={handleProceedToCheckout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/checkout"
          element={isAuthenticated ? <Checkout /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/bookservices"
          element={isAuthenticated ? <BookServices /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
};

export default App;
