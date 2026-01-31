import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from './Navbar';

// Import Sidebars
import StudentSidebar from '../pages/student/stu_sidebar';
import ClubSidebar from '../pages/club_leader/club_sidebar';
import AdminSidebar from '../pages/admin/ad_sidebar';

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
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Main');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set default active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/events')) setActiveItem('Event');
    else if (path.includes('/galleries')) setActiveItem('Galleries');
    else if (path.includes('/proposal')) setActiveItem('Proposal');
    else if (path.includes('/request')) setActiveItem('Request');
    else if (path.includes('/requests')) setActiveItem('Request');
    else if (path.includes('/chat')) setActiveItem('Chat');
    else if (path.includes('/report')) setActiveItem('Event Report');
    else if (path.includes('/query')) setActiveItem('Query Box');
    else setActiveItem('Main');
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    setActiveItem('Main');
    navigate('/dashboard');
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (itemId) => {
    setActiveItem(itemId);
    setSidebarOpen(false); // Close mobile sidebar
    
    // Navigate based on user role and selected item
    const role = user?.role || 'student';
    
    if (role === 'student') {
      switch (itemId) {
        case 'Main':
          navigate('/dashboard');
          break;
        case 'Event':
          navigate('/events');
          break;
        case 'Galleries':
          navigate('/galleries');
          break;
        default:
          navigate('/dashboard');
      }
    } else if (role === 'club_leader') {
      switch (itemId) {
        case 'Main':
          navigate('/dashboard');
          break;
        case 'Proposal':
          navigate('/proposal');
          break;
        case 'Request':
          navigate('/request');
          break;
        case 'Chat':
          navigate('/chat');
          break;
        case 'Event Report':
          navigate('/report');
          break;
        default:
          navigate('/dashboard');
      }
    } else if (role === 'admin') {
      switch (itemId) {
        case 'Main':
          navigate('/dashboard');
          break;
        case 'Request':
          navigate('/requests');
          break;
        case 'Query Box':
          navigate('/query');
          break;
        default:
          navigate('/dashboard');
      }
    }
  };

  // Get the appropriate sidebar component
  const getSidebarComponent = () => {
    const role = user?.role || 'student';
    
    switch (role) {
      case 'student':
        return (
          <StudentSidebar 
            activeItem={activeItem} 
            setActiveItem={handleSidebarNavigation}
          />
        );
      case 'club_leader':
        return (
          <ClubSidebar 
            activeItem={activeItem} 
            setActiveItem={handleSidebarNavigation}
          />
        );
      case 'admin':
        return (
          <AdminSidebar 
            activeItem={activeItem} 
            setActiveItem={handleSidebarNavigation}
          />
        );
      default:
        return (
          <StudentSidebar 
            activeItem={activeItem} 
            setActiveItem={handleSidebarNavigation}
          />
        );
    }
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

      <div className="flex min-h-[calc(100vh-5rem)]">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block flex-shrink-0">
          {getSidebarComponent()}
        </div>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative">
              {getSidebarComponent()}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full">
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
              {user?.role === 'club_leader' && (
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
      </div>
    </div>
  );
};

export default MainLayout;