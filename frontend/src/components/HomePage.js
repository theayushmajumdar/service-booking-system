// src/components/HomePage.js
import React from 'react';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to the Service Cart</h1>
        <p>Your one-stop solution for managing services.</p>
      </div>
    </div>
  );
};

export default HomePage;
