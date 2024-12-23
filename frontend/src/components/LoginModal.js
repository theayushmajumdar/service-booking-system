import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // State hooks for managing form input and status
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function to send OTP to the entered phone number
  const handleSendOtp = async () => {
    // Validate phone number format (e.g., +123456789012)
    if (!/^\+\d{12}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number with country code (e.g., +123456789012).");
      return;
    }

    // Save phone number to localStorage for later use
    localStorage.setItem('phoneNumber', phoneNumber);

    setLoading(true);
    setError(""); // Reset error message
    try {
      const response = await axios.post("http://localhost:8888/send-otp", { 
        phone: phoneNumber,
        username: username || "User" // Send username or default to "User"
      });
      alert(`OTP sent to ${phoneNumber}`);
      setIsOtpSent(true);
      setHash(response.data.hash); // Store the hash received for OTP verification
    } catch (error) {
      console.error(error);
      setError("Failed to send OTP. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to verify OTP entered by the user
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error message
    try {
      const response = await axios.post("http://localhost:8888/verify-otp", {
        phone: phoneNumber,
        code: otp,
        hash,
        username: username || "User" // Send username or default to "User"
      });

      if (response.data.message === "OTP verified successfully.") {
        alert("OTP Verified");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username || "User");
        localStorage.setItem('userId', response.data.userId);
        
        // Call onLoginSuccess to notify parent component
        onLoginSuccess(
          response.data.username || "User", 
          response.data.userId
        );
        
        navigate('/services'); 
        onClose(); 
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-gray-800 mb-2">Secure Login</h2>
          <p className="text-gray-500 text-sm">Enter your phone number and username (optional)</p>
        </div>

        {/* Display error message if any */}
        {error && <div className="text-red-500 text-center mb-4" aria-live="assertive">{error}</div>}

        <div className="space-y-4">
          {!isOtpSent ? (
            <>
              {/* Phone number input */}
              <input
                type="text"
                placeholder="Phone Number (e.g., +123456789012)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {/* Username input (optional) */}
              <input
                type="text"
                placeholder="Username (Optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {/* Button to send OTP */}
              <button
                onClick={handleSendOtp}
                className={`w-full py-3 text-white rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-300`}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              {/* OTP input */}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {/* Button to verify OTP */}
              <button
                onClick={handleVerifyOtp}
                className={`w-full py-3 text-white rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition-colors duration-300`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
