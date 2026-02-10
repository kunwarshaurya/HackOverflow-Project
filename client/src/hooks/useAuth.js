import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';  // Adjust path if needed

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;  // Assumes AuthContext provides { user, loading, isAuthenticated, login, logout, etc. }
}