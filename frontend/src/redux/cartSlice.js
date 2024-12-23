// cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Function to load the cart from localStorage
const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

const initialState = {
  items: loadCartFromLocalStorage(), // Load the cart items on initial load
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const service = action.payload;
      const existingItem = state.items.find(item => item.id === service.id);
      if (existingItem) {
        existingItem.quantity += service.quantity;
      } else {
        state.items.push(service);
      }
      localStorage.setItem('cart', JSON.stringify(state.items)); // Save to localStorage
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items)); // Save to localStorage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart'); // Clear from localStorage
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items)); // Save to localStorage
    },
    fetchCartFromServer: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCartQuantity, fetchCartFromServer } = cartSlice.actions;
export default cartSlice.reducer;
