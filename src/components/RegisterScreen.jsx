import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const navigate = useNavigate();
  
  const validateUsername = async (value) => {
  setUsername(value);
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(value)) {
    setUsernameMsg('Username must be 3-20 characters, only letters, numbers, _ or -');
    setIsUsernameValid(false);
    return;
  }

  try {
    const res = await axios.get(`https://craigslistclone-app2.ue.r.appspot.com/check-username/${value}`);
    if (res.data.valid) {
      setUsernameMsg('Username available ✔️');
      setIsUsernameValid(true);
    }
  } catch (err) {
    setUsernameMsg(err.response?.data?.reason || 'Invalid username');
    setIsUsernameValid(false);
  }
};

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
	if (!isUsernameValid) {
		setMessage('Please choose a valid username before registering.');
		return;
	  }

    try {
      const response = await axios.post(
        'https://craigslistclone-app2.ue.r.appspot.com/register',
        { email, password, username, fname, lname },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.user_id) {
        navigate('/?registered=1');  // Prompt to check email
      } else {
        setMessage('Unexpected response. Please try again.');
      }
    } catch (error) {
		  const serverMessage = error.response?.data?.error || error.message;
		  if (serverMessage.includes('Email is already registered')) {
			setMessage('That email is already in use. Please log in or use a different email.');
		  } else {
			setMessage('Registration failed: ' + serverMessage);
		  }
		}

  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="text"
          placeholder="First Name"
          className="border p-2 mb-4 w-full"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        />
		<input
          type="text"
          placeholder="Last Name"
          className="border p-2 mb-4 w-full"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          required
        />
		<input
          type="text"
          placeholder="Username"
          className="border p-2 mb-4 w-full"
          value={username}
          onChange={(e) => validateUsername(e.target.value)}
          required
        />
		<p className={`text-sm ${isUsernameValid ? 'text-green-500' : 'text-red-500'}`}>{usernameMsg}</p>
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
