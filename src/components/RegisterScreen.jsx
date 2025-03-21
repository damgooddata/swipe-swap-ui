import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionLevel, setSubscriptionLevel] = useState('free');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const cameFromCancel = new URLSearchParams(location.search).get('cancel') === '1';

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        'https://craigslistclone-app2.ue.r.appspot.com/register',
        {
          email,
          password,
          subscription_level: subscriptionLevel
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.checkout_url) {
        // Paid tiers → go to Stripe
        localStorage.setItem('pendingRegisterEmail', email);
        window.location.href = response.data.checkout_url;
      } else if (response.data.user_id) {
        // Free user or successful registration → redirect to home
        navigate('/?registered=1');
      } else {
        setMessage('Unexpected response. Please try again.');
      }
    } catch (error) {
      setMessage('Registration failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {cameFromCancel && (
        <p className="text-yellow-600 mb-2">You canceled payment. Please choose a subscription to proceed.</p>
      )}
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Level</label>
        <select
          className="border p-2 mb-4 w-full"
          value={subscriptionLevel}
          onChange={(e) => setSubscriptionLevel(e.target.value)}
        >
          <option value="free">Free</option>
          <option value="level_1">Level 1 (Paid)</option>
          <option value="level_2">Level 2 (Paid)</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
