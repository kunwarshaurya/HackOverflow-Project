import React, { useState, useEffect } from 'react';
import { 
  Home, 
  LogOut, 
  Bell, 
  Menu, 
  Search 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = ({ role = 'student', onMenuToggle, onHomeClick, onLogout }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: "Event proposal approved", type: "success", time: "2 min ago", read: false },
      { id: 2, message: "New venue booking available", type: "info", time: "1 hour ago", read: false },
      { id: 3, message: "Club meeting tomorrow at 3 PM", type: "reminder", time: "3 hours ago", read: true }
    ]);
  }, []);

  const getRoleDisplayName = (userRole) => {
    switch (userRole) {
      case 'student': return 'Student';
      case 'club_leader': return 'Club Leader';
      case 'club_lead': return 'Club Leader';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-16 bg-[#493129] border-b border-[#8b597b]/30 px-6 flex items-center justify-between shadow-lg z-50">
      {/* LEFT: Brand */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col cursor-pointer" onClick={onHomeClick}>
          <h1 className="text-[#ffeadb] font-black tracking-[0.2em] text-xl leading-none uppercase">
            UNICAMPUS
          </h1>
          <span className="text-[#efa3a0] text-xs font-bold uppercase tracking-widest">
            {getRoleDisplayName(user?.role)}
          </span>
        </div>
      </div>

      {/* CENTER: Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-12">
        <div className="w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffdec7]/30 group-focus-within:text-[#efa3a0] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-full bg-black/20 border border-[#8b597b]/20 rounded-xl py-2 pl-10 pr-4 text-[#ffeadb] placeholder-[#ffdec7]/20 focus:outline-none focus:border-[#efa3a0]/40 transition-all font-medium text-sm"
          />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onHomeClick}
          className="p-2 rounded-xl text-[#ffdec7]/60 hover:text-[#efa3a0] hover:bg-white/5 transition-all group"
          title="Home"
        >
          <Home size={18} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 text-[#ffdec7]/60 hover:text-[#ffeadb] border border-white/5 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#efa3a0] text-white rounded-full text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#8b597b]/10 z-50">
              <div className="p-4 border-b border-[#ffeadb]">
                <h3 className="font-black text-[#493129] text-lg">Notifications</h3>
                <p className="text-xs text-[#493129]/60 font-bold">
                  {unreadCount > 0 ? `${unreadCount} new notifications` : 'All caught up!'}
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-[#ffeadb] last:border-b-0 hover:bg-[#ffeadb]/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-[#efa3a0]/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-[#efa3a0]' : 'bg-transparent'}`}></div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${!notification.read ? 'text-[#493129]' : 'text-[#493129]/70'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs opacity-60 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-[#8b597b]/20 mx-2 hidden sm:block"></div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[#ffeadb] font-bold text-sm">{user?.name || 'User'}</p>
            <p className="text-[#efa3a0] text-xs font-bold uppercase tracking-widest">
              {getRoleDisplayName(user?.role)}
            </p>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#8b597b] hover:bg-[#efa3a0] text-[#ffeadb] hover:text-[#493129] rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95"
          >
            <span>Logout</span>
            <LogOut size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;