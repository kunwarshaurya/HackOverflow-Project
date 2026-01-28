import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const MENUS = {
    admin: [
      { label: 'Admin Dashboard', path: '/admin' },
      { label: 'Pending Approvals', path: '/admin/approvals' },
    ],
    club_lead: [
      { label: 'My Events', path: '/club' },
      { label: 'Create New Event', path: '/club/create-event' },
    ],
    student: [
      { label: 'Events Feed', path: '/student' },
      { label: 'My Tickets', path: '/student/tickets' },
    ]
  };

  const currentMenu = user ? MENUS[user.role] || [] : [];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed top-0 left-0 pt-16 z-40">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-xs uppercase text-gray-500 font-bold tracking-wider">
          {user?.role} Panel
        </h3>
      </div>
      
      <nav className="mt-6 px-4 space-y-2">
        {currentMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;