import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">HackOverflow</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {user?.role === 'student' && (
                  <Link to="/student" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600">Events</Link>
                )}
                {user?.role === 'club_lead' && (
                  <>
                    <Link to="/club" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600">My Dashboard</Link>
                    <Link to="/club/create-event" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600">New Event</Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600">Admin Panel</Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Hi, {user?.name}</span>
                <button onClick={handleLogout} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Logout</button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-900 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;