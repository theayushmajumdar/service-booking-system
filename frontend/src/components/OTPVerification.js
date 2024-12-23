import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../redux/cartSlice'; // Import cart actions

const OTPVerification = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requestOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8888/send-otp', { phone });
      setHash(response.data.hash);
      setMessage('OTP sent! Please check your phone.');
      setError('');
    } catch (err) {
      setError(err.response.data.error || 'Failed to request OTP');
      setMessage('');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8888/verify-otp', {
        phone,
        code: otp,
        hash,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      dispatch(login(phone)); // Dispatch login action with phone
      setMessage('OTP verified successfully!');
      setError('');

      // Optional: Sync cart with the server, if needed
      // Sync cart with server (if backend supports it)

      navigate('/services'); // Redirect after successful OTP verification
    } catch (err) {
      setError(err.response.data.error || 'Invalid OTP or verification failed');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">OTP Verification</h2>
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              placeholder="Enter phone number (e.g., +1234567890)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <button
              onClick={requestOtp}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Request OTP
            </button>
          </div>

          {hash && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div>
                <button
                  onClick={verifyOtp}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
