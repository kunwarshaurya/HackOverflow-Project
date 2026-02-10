import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from './Navbar';

// Import the main dashboard files that have everything
import StudentMain from '../pages/student/stu_main';
import ClubMain from '../pages/club_leader/club_main';
import AdminMain from '../pages/admin/ad_main';

const MainLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleMenuToggle = () => {
    // Mobile menu toggle if needed
  };

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffeadb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-[#8b597b] mx-auto mb-4"></div>
          <p className="text-[#493129] font-bold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffeadb]">
      {/* Navbar integrated for all roles */}
      <Navbar 
        role={user?.role || 'student'}
        onMenuToggle={handleMenuToggle}
        onHomeClick={handleHomeClick}
        onLogout={handleLogout}
      />

      {/* Main Content - Each main.jsx has its own sidebar and everything */}
      <Routes>
        {/* Student Routes - calls stu_main.jsx which has everything */}
        {user?.role === 'student' && (
          <Route path="*" element={<StudentMain />} />
        )}

        {/* Club Leader Routes - calls club_main.jsx which has everything */}
        {(user?.role === 'club_leader' || user?.role === 'club_lead') && (
          <Route path="*" element={<ClubMain />} />
        )}

        {/* Admin Routes - calls ad_main.jsx which has everything */}
        {user?.role === 'admin' && (
          <Route path="*" element={<AdminMain />} />
        )}

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default MainLayout;