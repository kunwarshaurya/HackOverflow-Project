import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="h-16 bg-white shadow-sm fixed top-0 w-full z-50 flex items-center justify-between px-6">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        HackOverflow
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;