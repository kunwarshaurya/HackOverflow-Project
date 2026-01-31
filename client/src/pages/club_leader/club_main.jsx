import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Plus
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import eventService from '../../services/event.service';
import analyticsService from '../../services/analytics.service';

const ClubMain = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    activeMembers: 0,
    monthlyGrowth: 0
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

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-[#ffeadb] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">+{change}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-black text-[#493129] mb-1">{value}</h3>
      <p className="text-sm font-bold text-[#493129]/60 uppercase tracking-wide">{title}</p>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-[#ffeadb] overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#8b597b] animate-pulse"></div>
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Club Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
            Welcome back, <span className="text-[#8b597b]">{user?.name || 'Leader'}!</span>
          </h1>
          <p className="text-[#493129]/60 font-bold text-lg">Manage your club activities and track performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Calendar}
            title="Total Events"
            value={stats.totalEvents || events.length}
            change={stats.monthlyGrowth}
            color="bg-[#8b597b]"
          />
          <StatCard 
            icon={Clock}
            title="Pending Approvals"
            value={stats.pendingApprovals || events.filter(e => e.status === 'pending').length}
            color="bg-[#efa3a0]"
          />
          <StatCard 
            icon={Users}
            title="Active Members"
            value={stats.activeMembers || 45}
            change={12}
            color="bg-[#493129]"
          />
          <StatCard 
            icon={BarChart3}
            title="Success Rate"
            value="94%"
            change={5}
            color="bg-green-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Events */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-[#ffeadb] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#493129]">Recent Events</h2>
              <button className="bg-[#8b597b] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors flex items-center gap-2">
                <Plus size={16} />
                New Event
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
              {events.length > 0 ? (
                events.slice(0, 5).map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-4 bg-[#ffeadb] rounded-2xl hover:bg-[#ffdec7] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#8b597b] rounded-xl flex items-center justify-center text-white">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#493129]">{event.title}</h3>
                        <p className="text-sm text-[#493129]/60">
                          {new Date(event.date).toLocaleDateString()} • {event.venue}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(event.status)}`}>
                        {event.status?.toUpperCase()}
                      </span>
                      {event.status === 'approved' && <CheckCircle className="text-green-500" size={20} />}
                      {event.status === 'pending' && <Clock className="text-yellow-500" size={20} />}
                      {event.status === 'rejected' && <AlertCircle className="text-red-500" size={20} />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-[#493129]/30 mb-4" />
                  <p className="text-[#493129]/60 font-bold">No events yet</p>
                  <p className="text-sm text-[#493129]/40">Create your first event to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 border border-[#ffeadb] shadow-lg">
              <h3 className="text-xl font-black text-[#493129] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-[#8b597b] text-white p-4 rounded-2xl font-bold hover:bg-[#493129] transition-colors flex items-center gap-3">
                  <FileText size={20} />
                  Create Proposal
                </button>
                <button className="w-full bg-[#efa3a0] text-white p-4 rounded-2xl font-bold hover:bg-[#8b597b] transition-colors flex items-center gap-3">
                  <Calendar size={20} />
                  Book Venue
                </button>
                <button className="w-full bg-[#ffdec7] text-[#493129] p-4 rounded-2xl font-bold hover:bg-[#efa3a0] hover:text-white transition-colors flex items-center gap-3">
                  <MessageSquare size={20} />
                  Team Chat
                </button>
              </div>
            </div>

            {/* Club Stats */}
            <div className="bg-gradient-to-br from-[#8b597b] to-[#493129] rounded-[2.5rem] p-6 text-white">
              <h3 className="text-xl font-black mb-4">Club Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Event Success Rate</span>
                  <span className="text-[#efa3a0] font-black">94%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-[#efa3a0] h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Member Engagement</span>
                  <span className="text-[#efa3a0] font-black">87%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-[#efa3a0] h-2 rounded-full" style={{ width: '87%' }}></div>
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

export default ClubMain;