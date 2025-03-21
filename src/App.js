import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import UserLanding from './components/UserLanding';  // ⬅️ Import it here

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/user" element={<UserLanding />} />  {/* ⬅️ Add this */}
      </Routes>
    </Router>
  );
}

export default App;
