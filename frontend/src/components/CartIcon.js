// CartIcon.js
import React from 'react';
import { ShoppingCart } from 'lucide-react';

const CartIcon = ({ cartCount, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="relative text-white hover:text-gray-300 transition duration-300"
    >
      <ShoppingCart className="w-6 h-6" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
