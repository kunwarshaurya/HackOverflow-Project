import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import ONLY the Landing Page
import LandingPage from './pages/landing_pg';

// We strip out everything else (AuthProvider, MainLayout, ProtectedRoutes)
// to ensure the Landing Page renders without dependencies.

const App = () => {
  return (
    <Router>
      <Routes>
        {/* The Only Route that matters right now */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Placeholders so the 'Link' buttons don't crash the app if clicked */}
        <Route path="/login" element={<div className="p-10 text-xl">Login Page (Coming Soon)</div>} />
        <Route path="/signup" element={<div className="p-10 text-xl">Signup Page (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
};

export default App;