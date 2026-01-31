import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import eventService from '../../services/event.service';
import analyticsService from '../../services/analytics.service';

const AdminMain = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingRequests: 0,
    totalUsers: 0,
    systemHealth: 99.9
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch events
      const eventsResult = await eventService.getAllEvents();
      if (eventsResult.success) {
        setEvents(eventsResult.data || []);
      }

      // Fetch analytics
      const analyticsResult = await analyticsService.getDashboardStats();
      if (analyticsResult.success) {
        setStats(analyticsResult.data || stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-[#ffeadb] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
            <span className="text-sm font-bold">{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-black text-[#493129] mb-1">{value}</h3>
      <p className="text-sm font-bold text-[#493129]/60 uppercase tracking-wide">{title}</p>
      {subtitle && <p className="text-xs text-[#493129]/40 mt-1">{subtitle}</p>}
    </div>
  );

  const PriorityAlert = ({ type, message, count }) => {
    const getAlertColor = (alertType) => {
      switch (alertType) {
        case 'urgent': return 'bg-red-50 border-red-200 text-red-800';
        case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };

    const getAlertIcon = (alertType) => {
      switch (alertType) {
        case 'urgent': return AlertTriangle;
        case 'warning': return Clock;
        case 'info': return FileText;
        default: return Activity;
      }
    };

    const AlertIcon = getAlertIcon(type);

    return (
      <div className={`p-4 rounded-2xl border ${getAlertColor(type)} flex items-center gap-3`}>
        <AlertIcon size={20} />
        <div className="flex-1">
          <p className="font-bold text-sm">{message}</p>
          {count && <p className="text-xs opacity-70">{count} items require attention</p>}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffeadb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8b597b]"></div>
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </div>
    );
  }

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');

  return (
    <div className="min-h-screen bg-[#ffeadb] overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#efa3a0] animate-pulse"></div>
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">System Administration</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
            Admin <span className="text-[#8b597b]">Dashboard</span>
          </h1>
          <p className="text-[#493129]/60 font-bold text-lg">Monitor and manage campus activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Calendar}
            title="Total Events"
            value={events.length}
            subtitle="This month"
            color="bg-[#8b597b]"
            trend={15}
          />
          <StatCard 
            icon={Clock}
            title="Pending Requests"
            value={pendingEvents.length}
            subtitle="Require approval"
            color="bg-[#efa3a0]"
          />
          <StatCard 
            icon={Users}
            title="Active Users"
            value={stats.totalUsers || 1247}
            subtitle="Students & Leaders"
            color="bg-[#493129]"
            trend={8}
          />
          <StatCard 
            icon={Shield}
            title="System Health"
            value={`${stats.systemHealth || 99.9}%`}
            subtitle="Uptime"
            color="bg-green-500"
            trend={0.1}
          />
        </div>

        {/* Priority Alerts */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#493129] mb-4">Priority Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PriorityAlert 
              type="urgent"
              message="Pending event approvals"
              count={pendingEvents.length}
            />
            <PriorityAlert 
              type="warning"
              message="Venue conflicts detected"
              count={2}
            />
            <PriorityAlert 
              type="info"
              message="Monthly reports ready"
              count={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-[#ffeadb] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#493129]">Recent Requests</h2>
              <button className="bg-[#8b597b] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
              {events.length > 0 ? (
                events.slice(0, 6).map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-4 bg-[#ffeadb] rounded-2xl hover:bg-[#ffdec7] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#8b597b] rounded-xl flex items-center justify-center text-white">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#493129]">{event.title}</h3>
                        <p className="text-sm text-[#493129]/60">
                          {event.clubName} • {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(event.status)}`}>
                        {event.status?.toUpperCase()}
                      </span>
                      {event.status === 'approved' && <CheckCircle className="text-green-500" size={20} />}
                      {event.status === 'pending' && <Clock className="text-yellow-500" size={20} />}
                      {event.status === 'rejected' && <AlertTriangle className="text-red-500" size={20} />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-[#493129]/30 mb-4" />
                  <p className="text-[#493129]/60 font-bold">No requests yet</p>
                  <p className="text-sm text-[#493129]/40">Event requests will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* System Overview */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 border border-[#ffeadb] shadow-lg">
              <h3 className="text-xl font-black text-[#493129] mb-4">System Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#493129]/80">Server Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-bold text-sm">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#493129]/80">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-bold text-sm">Healthy</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#493129]/80">API Response</span>
                  <span className="text-[#8b597b] font-bold text-sm">~45ms</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#8b597b] to-[#493129] rounded-[2.5rem] p-6 text-white">
              <h3 className="text-xl font-black mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Events This Month</span>
                  <span className="text-[#efa3a0] font-black">{events.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Approval Rate</span>
                  <span className="text-[#efa3a0] font-black">
                    {events.length > 0 ? Math.round((approvedEvents.length / events.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Active Clubs</span>
                  <span className="text-[#efa3a0] font-black">23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default AdminMain;