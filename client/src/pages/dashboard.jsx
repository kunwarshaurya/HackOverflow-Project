import { useState, useEffect } from 'react';
import { Calendar, Users, BarChart3, MapPin, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useEvents from '../hooks/use.events';
import useClubs from '../hooks/useClubs';
import useVenues from '../hooks/useVenues';
import analyticsService from '../services/analytics.service';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { events, loading: eventsLoading, fetchEvents } = useEvents();
  const { clubs, loading: clubsLoading, fetchClubs } = useClubs();
  const { venues, loading: venuesLoading, fetchVenues } = useVenues();
  
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    // Fetch all data when component mounts
    fetchEvents();
    fetchClubs();
    fetchVenues();
    fetchAnalytics();
  }, [fetchEvents, fetchClubs, fetchVenues]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    const result = await analyticsService.getDashboardStats();
    if (result.success) {
      setAnalytics(result.data);
    }
    setAnalyticsLoading(false);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg p-6 shadow-lg border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, onClick, color, to }) => {
    const content = (
      <div className={`bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow border-l-4 ${color} hover:scale-105 transform transition-transform`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    );

    return to ? <Link to={to}>{content}</Link> : <div onClick={onClick}>{content}</div>;
  };

  const RecentItem = ({ title, subtitle, status, time }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="text-right">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'approved' ? 'bg-green-100 text-green-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );

  if (eventsLoading || clubsLoading || venuesLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600">Here's what's happening on campus today</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/events"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                View Events
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={events?.length || 0}
            icon={<Calendar className="h-6 w-6 text-blue-600" />}
            color="border-l-blue-500"
          />
          <StatCard
            title="Active Clubs"
            value={clubs?.length || 0}
            icon={<Users className="h-6 w-6 text-green-600" />}
            color="border-l-green-500"
          />
          <StatCard
            title="Available Venues"
            value={venues?.length || 0}
            icon={<MapPin className="h-6 w-6 text-purple-600" />}
            color="border-l-purple-500"
          />
          <StatCard
            title="Analytics Score"
            value={analytics?.score || '98%'}
            icon={<BarChart3 className="h-6 w-6 text-orange-600" />}
            color="border-l-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Create Event"
              description="Plan your next campus event"
              icon={<Plus className="h-6 w-6 text-blue-600" />}
              color="border-l-blue-500"
              to="/events"
            />
            <QuickActionCard
              title="Join Club"
              description="Discover and join clubs"
              icon={<Users className="h-6 w-6 text-green-600" />}
              color="border-l-green-500"
              onClick={() => console.log('Join club')}
            />
            <QuickActionCard
              title="Book Venue"
              description="Reserve spaces for events"
              icon={<MapPin className="h-6 w-6 text-purple-600" />}
              color="border-l-purple-500"
              onClick={() => console.log('Book venue')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recent Events</h3>
              <Link to="/events" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {events?.slice(0, 5).map((event, index) => (
                <RecentItem
                  key={index}
                  title={event.title || `Event ${index + 1}`}
                  subtitle={event.description || 'Event description'}
                  status={event.status || 'pending'}
                  time={event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Recently'}
                />
              ))}
              {(!events || events.length === 0) && (
                <p className="text-gray-500 text-center py-4">No events found</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Clubs</h3>
            <div className="space-y-4">
              {clubs?.slice(0, 5).map((club, index) => (
                <RecentItem
                  key={index}
                  title={club.name || `Club ${index + 1}`}
                  subtitle={club.description || 'Club description'}
                  status="active"
                  time={`${club.memberCount || 0} members`}
                />
              ))}
              {(!clubs || clubs.length === 0) && (
                <p className="text-gray-500 text-center py-4">No clubs found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;