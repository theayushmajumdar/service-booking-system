import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart, fetchCartFromServer, updateCartQuantity } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import { Trash2, Plus, Minus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Cart = () => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [addressDetails, setAddressDetails] = useState({
    buildingNumber: '',
    streetName: '',
    city: '',
    postalCode: '',
  });
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const username = useSelector(state => state.auth.username); // Assuming username is stored in Redux
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCartFromServer());
    }
    // Retrieve phone number from local storage
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = (subtotal - discount).toFixed(2);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.info(`Item removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      dispatch(clearCart());
      toast.error('Cart cleared');
    }
  };

  const handleQuantityChange = (item, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(item.id);
    } else {
      dispatch(updateCartQuantity({ id: item.id, quantity }));
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      toast.success('Coupon applied: 10% discount!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddressChange = (e) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitAddress = async () => {
    const ticketNumber = uuidv4().slice(0, 8); // Generate unique 8-digit ticket number
    const orderDetails = {
      ticketNumber,
      ticketStatus: 'Pending',
      services: cartItems.map(item => item.name),
      totalPrice: total,
      username: username || 'User',
      phoneNumber: phoneNumber, // Include phone number in order details
      address: `${addressDetails.buildingNumber}, ${addressDetails.streetName}, ${addressDetails.city}, ${addressDetails.postalCode}`,
    };

    // Redirect to /bookservices page and pass data through navigation state
    navigate('/bookservices', { state: { orderDetails } });
    handleCloseModal();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707H17m0 0a2 2 0 100 4 2 2 0 0 0 0-4zm-8 2a2 2 0 11-4 0 2 2 0 0 1 4 0z" />
          </svg>
          <p className="text-2xl text-gray-600 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/services')} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          {username ? `${username}'s Cart` : "Your Cart"}
        </h1>

        {/* Cart items & order summary */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items Column */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden flex items-center p-4 hover:shadow-lg transition duration-300">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-500 mb-2">${item.price.toFixed(2)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <button onClick={() => handleQuantityChange(item, item.quantity - 1)} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition">
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 1)} className="w-16 text-center border rounded" />
                    <button onClick={() => handleQuantityChange(item, item.quantity + 1)} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition">
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg mb-2">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700 transition">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow-md rounded-lg p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleApplyCoupon} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Apply
                </button>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-xl text-gray-800">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button onClick={handleOpenModal} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 shadow-md">
                Proceed to Checkout
              </button>
              <button onClick={handleClearCart} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300">
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full">
              <h2 className="text-2xl font-semibold mb-4">Enter Shipping Address</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="buildingNumber"
                  value={addressDetails.buildingNumber}
                  onChange={handleAddressChange}
                  placeholder="Building Number"
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  name="streetName"
                  value={addressDetails.streetName}
                  onChange={handleAddressChange}
                  placeholder="Street Name"
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  name="city"
                  value={addressDetails.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={addressDetails.postalCode}
                  onChange={handleAddressChange}
                  placeholder="Postal Code"
                  className="w-full p-3 border rounded-md"
                />
                
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={handleCloseModal} className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600">Cancel</button>
                <button onClick={handleSubmitAddress} className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;