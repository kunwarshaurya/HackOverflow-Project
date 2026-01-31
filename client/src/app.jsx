import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import LandingPage from './pages/landing_pg';
import MainLayout from './components/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffeadb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8b597b]"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

// App Routes Component (needs to be inside AuthProvider)
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* Landing page with integrated auth - redirect to dashboard if already logged in */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
        
        {/* Protected routes - all go through MainLayout which handles role-based routing */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;