import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from './Navbar';

// Import Pages
import StudentMain from '../pages/student/stu_main';
import StudentEvents from '../pages/student/stu_event';
import StudentGalleries from '../pages/student/stu_galaries';

import ClubMain from '../pages/club_leader/club_main';
import ClubProposal from '../pages/club_leader/club_proposal';
import ClubRequest from '../pages/club_leader/club_req';
import ClubChat from '../pages/club_leader/club_chat';
import ClubReport from '../pages/club_leader/club_report';

import AdminMain from '../pages/admin/ad_main';
import AdminRequests from '../pages/admin/ad_requests';
import AdminQueryBox from '../pages/admin/ad_querbybox';

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
    <div className="min-h-screen bg-[#ffeadb] overflow-x-hidden">
      {/* Navbar */}
      <Navbar 
        role={user?.role || 'student'}
        onMenuToggle={handleMenuToggle}
        onHomeClick={handleHomeClick}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="pt-20">
        <Routes>
          {/* Student Routes */}
          {user?.role === 'student' && (
            <>
              <Route path="/dashboard" element={<StudentMain />} />
              <Route path="/events" element={<StudentEvents />} />
              <Route path="/galleries" element={<StudentGalleries />} />
            </>
          )}

          {/* Club Leader Routes */}
          {user?.role === 'club_lead' && (
            <>
              <Route path="/dashboard" element={<ClubMain />} />
              <Route path="/proposal" element={<ClubProposal />} />
              <Route path="/request" element={<ClubRequest />} />
              <Route path="/chat" element={<ClubChat />} />
              <Route path="/report" element={<ClubReport />} />
            </>
          )}

          {/* Admin Routes */}
          {user?.role === 'admin' && (
            <>
              <Route path="/dashboard" element={<AdminMain />} />
              <Route path="/requests" element={<AdminRequests />} />
              <Route path="/query" element={<AdminQueryBox />} />
            </>
          )}

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainLayout;