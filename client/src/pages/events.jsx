import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import useEvents from '../hooks/use.events';
import useAuth from '../hooks/useAuth';

const Events = () => {
  const { events, loading, fetchEvents, createNewEvent } = useEvents();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const result = await createNewEvent(newEvent);
    if (result.success) {
      setShowCreateForm(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        capacity: ''
      });
      fetchEvents(); // Refresh the events list
    }
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-orange-500">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          event.status === 'approved' ? 'bg-green-100 text-green-800' :
          event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status || 'pending'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{event.description}</p>
      
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{event.date || 'Date TBD'}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>{event.time || 'Time TBD'}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{event.venue || 'Venue TBD'}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          <span>{event.capacity || 'Unlimited'} attendees</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
            <p className="text-gray-600">Discover and manage events happening on campus</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    min="1"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Create Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={event._id || index} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Be the first to create an event!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;