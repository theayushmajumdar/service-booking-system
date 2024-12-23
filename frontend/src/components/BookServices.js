import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';

const BookServices = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the location object which contains passed state
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null); // State to hold order details

  useEffect(() => {
    // Log to ensure we received the correct state from Cart.js
    console.log(location.state);

    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    } else {
      console.error('Order details not found');
      navigate('/'); // Redirect to home if orderDetails are not found
    }

    // Fetch phone number from localStorage (if not passed from Cart.js)
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      console.log('Phone number fetched from localStorage:', storedPhoneNumber);
    } else {
      console.error('Phone number not found in localStorage');
      navigate('/login');
    }
  }, [location.state, navigate]);

  const handleSubmitBooking = async () => {
    if (!orderDetails) {
      console.error('Order details are missing');
      return;
    }
 
    try {
      const response = await axios.post('http://localhost:8888/api/book-services', {
        orderDetails,
        phoneNumber,
      });

      // Handle response (e.g., show a success message or redirect to a confirmation page)
      if (response.status === 200) {
        console.log('Booking successful', response.data);

        dispatch(clearCart());

        // Redirect to a confirmation page or order details page
        navigate('/confirmation', { state: { bookingId: response.data.bookingId } });
      } else {
        console.error('Booking failed', response.data);
      }
    } catch (error) {
      console.error('Error during booking', error);
    }
  };

  // Display a loading state until orderDetails are available
  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Booking Summary
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

          {/* Display Order Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Ticket Number</span>
              <span>{orderDetails.ticketNumber}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Ticket Status</span>
              <span>{orderDetails.ticketStatus}</span> {/* Display ticketStatus */}
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Services</span>
              <span>{orderDetails.services.join(', ')}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Total Price</span>
              <span>${orderDetails.totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Username</span>
              <span>{orderDetails.username}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Address</span>
              <span>{orderDetails.address}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Phone Number</span>
              <span>{phoneNumber}</span>
            </div>
          </div>

          {/* Phone Number Display */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mt-2">You cannot change your phone number.</p>
          </div>

          {/* Booking Action */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmitBooking}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookServices;
