import React, { useState, useEffect } from 'react';
import { 
  Home, 
  LogOut, 
  Bell, 
  Menu, 
  Search 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import notificationService from '../services/notification.service';

const Navbar = ({ role = 'student', onMenuToggle, onHomeClick, onLogout }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await notificationService.getNotifications();
      if (result.success) {
        setNotifications(result.data || []);
      } else {
        // Fallback to mock notifications if API fails
        const mockNotifications = [
          { id: 1, message: "Event proposal approved", type: "success", time: "2 min ago", read: false },
          { id: 2, message: "New venue booking available", type: "info", time: "1 hour ago", read: false },
          { id: 3, message: "Club meeting tomorrow at 3 PM", type: "reminder", time: "3 hours ago", read: true }
        ];
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock notifications
      const mockNotifications = [
        { id: 1, message: "Event proposal approved", type: "success", time: "2 min ago", read: false },
        { id: 2, message: "New venue booking available", type: "info", time: "1 hour ago", read: false },
        { id: 3, message: "Club meeting tomorrow at 3 PM", type: "reminder", time: "3 hours ago", read: true }
      ];
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      if (result.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await notificationService.markAllAsRead();
      if (result.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-200 text-green-800';
      case 'info': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'reminder': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'warning': return 'bg-orange-100 border-orange-200 text-orange-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getRoleDisplayName = (userRole) => {
    switch (userRole) {
      case 'student': return 'Student';
      case 'club_leader': return 'Club Leader';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="w-full h-20 bg-[#493129] border-b border-[#8b597b]/30 px-6 flex items-center justify-between shadow-2xl relative z-[100]">
      {/* LEFT: Brand and Menu */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuToggle}
          className="p-2.5 rounded-xl bg-white/5 text-[#efa3a0] hover:bg-[#8b597b]/20 hover:text-[#ffeadb] transition-all duration-300 lg:hidden border border-white/5"
        >
          <Menu size={24} />
        </button>

        <div className="flex flex-col cursor-pointer" onClick={onHomeClick}>
          <h1 className="text-[#ffeadb] font-black tracking-[0.2em] text-2xl leading-none uppercase">
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffdec7]/30 group-focus-within:text-[#efa3a0] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-full bg-black/20 border border-[#8b597b]/20 rounded-2xl py-2.5 pl-12 pr-4 text-[#ffeadb] placeholder-[#ffdec7]/20 focus:outline-none focus:border-[#efa3a0]/40 transition-all font-medium text-sm"
          />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onHomeClick}
          className="p-3 rounded-xl text-[#ffdec7]/60 hover:text-[#efa3a0] hover:bg-white/5 transition-all group"
          title="Home"
        >
          <Home size={22} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 rounded-xl bg-white/5 text-[#ffdec7]/60 hover:text-[#ffeadb] border border-white/5 transition-all"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-[#efa3a0] text-white rounded-full text-xs font-bold flex items-center justify-center shadow-[0_0_8px_#efa3a0]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#8b597b]/10 z-50">
              <div className="p-4 border-b border-[#ffeadb] flex items-center justify-between">
                <div>
                  <h3 className="font-black text-[#493129] text-lg">Notifications</h3>
                  <p className="text-xs text-[#493129]/60 font-bold">
                    {unreadCount > 0 ? `${unreadCount} new notifications` : 'All caught up!'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-bold text-[#8b597b] hover:text-[#493129] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b597b] mx-auto"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-[#ffeadb] last:border-b-0 hover:bg-[#ffeadb]/50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-[#efa3a0]/5' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
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
                  ))
                ) : (
                  <div className="p-6 text-center text-[#493129]/60">
                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-bold">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-[#8b597b]/20 mx-2 hidden sm:block"></div>

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
            className="flex items-center gap-2 px-6 py-2.5 bg-[#8b597b] hover:bg-[#efa3a0] text-[#ffeadb] hover:text-[#493129] rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95"
          >
            <span>Logout</span>
            <LogOut size={16} strokeWidth={3} />
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800;900&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </nav>
  );
};

export default Navbar;