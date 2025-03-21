import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [homeMessage, setHomeMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const registered = queryParams.get('registered') === '1';
  const messageParam = queryParams.get('msg');

  useEffect(() => {
    if (registered) {
      setHomeMessage('Registration successful! Please check your email to verify your account before logging in.');
    } else if (messageParam) {
      setHomeMessage(decodeURIComponent(messageParam));
    }
  }, [registered, messageParam]);

  const handleResend = async () => {
    try {
      const res = await axios.post('https://craigslistclone-app2.ue.r.appspot.com/resend-verification', { email });
      const msg = res.data.message || 'Verification email resent!';
      navigate(`/?msg=${encodeURIComponent(msg)}`);
    } catch (error) {
      const errorMsg = 'Failed to resend verification email.';
      navigate(`/?msg=${encodeURIComponent(errorMsg)}`);
    }
  };

  const handleCloseModal = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Swipe Swap</h1>

      {homeMessage && (
        <p className="text-green-600 mb-4 text-center w-96">{homeMessage}</p>
      )}

      <div className="space-x-4 mb-4">
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
        <button 
          onClick={() => navigate('/register')}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
        >
          Register
        </button>
      </div>

      <button 
        onClick={() => setShowModal(true)}
        className="text-sm text-blue-500 hover:underline"
      >
        Resend Verification Email
      </button>

      <p className="mt-4 text-gray-500 italic">Forgot Password coming soon...</p>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Resend Verification Email</h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-2 mb-4 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              onClick={handleResend}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Resend Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
