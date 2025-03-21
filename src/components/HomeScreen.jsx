import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Swipe Swap</h1>
      <div className="space-x-4">
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
        <button 
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
        >
          Register
        </button>
      </div>
      <p className="mt-4 text-gray-500 italic">Forgot Password coming soon...</p>
    </div>
  );
}
