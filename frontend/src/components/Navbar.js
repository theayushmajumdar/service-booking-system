import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux'; // Import useSelector to get cart items
import LoginModal from './LoginModal';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || 'User');

  // Access cart items from Redux store using useSelector
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Calculate total cart count

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('User');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;

  // Open login modal
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Navigate to the cart page or open the login modal if not logged in
  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate('/cart');
    } else {
      setIsLoginModalOpen(true); // Open login modal if not logged in
    }
    setIsMobileMenuOpen(false);
  };

  // Update username after successful login
  const handleLoginSuccess = (newUsername) => {
    setUsername(newUsername);
    setIsLoginModalOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      {/* Mobile View */}
      <div className="flex w-full md:hidden items-center justify-between">
        {/* Left side: Service App Text */}
        <div className="text-white text-2xl">Service App</div>

        {/* Right side: Cart and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCartClick}
            className="relative text-white hover:text-gray-300 transition duration-300"
          >
            <ShoppingCart className="w-5 h-5" /> {/* Smaller size for mobile view */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none p-1 rounded-md hover:text-gray-300 transition duration-300"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{ fontSize: '1.2rem' }}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex w-full items-center justify-between">
        {/* Left side: Service App */}
        <div className="text-white text-2xl">Service App</div>

        {/* Right side: User Info, Cart, and Actions */}
        <div className="flex items-center space-x-6">
          {isLoggedIn && <span className="text-white">Hi, {username}</span>}
          <button
            onClick={handleCartClick}
            className="relative text-white hover:text-gray-300 transition duration-300"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-800 p-4 space-y-4 md:hidden">
          {isLoggedIn ? (
            <>
              <span className="text-white">Hi, {username}</span>
              <br />
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
};

export default Navbar;
