import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Share2,
  Filter,
  Search,
  ChevronDown,
  Star,
  Ticket
} from 'lucide-react';
import eventService from '../../services/event.service';

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedEvents, setLikedEvents] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'academic', name: 'Academic' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'sports', name: 'Sports' },
    { id: 'technical', name: 'Technical' },
    { id: 'social', name: 'Social' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const result = await eventService.getAllEvents();
      if (result.success) {
        // Filter only approved events for students
        const approvedEvents = (result.data || []).filter(event => event.status === 'approved');
        setEvents(approvedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => 
        event.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  };

  const toggleLike = (eventId) => {
    const newLikedEvents = new Set(likedEvents);
    if (newLikedEvents.has(eventId)) {
      newLikedEvents.delete(eventId);
    } else {
      newLikedEvents.add(eventId);
    }
    setLikedEvents(newLikedEvents);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  const EventCard = ({ event }) => {
    const dateInfo = formatDate(event.date);
    const isLiked = likedEvents.has(event._id);

    return (
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#ffeadb]">
        {/* Event Image */}
        <div className="h-48 bg-gradient-to-br from-[#8b597b] to-[#493129] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 left-4 bg-white rounded-2xl p-3 text-center shadow-lg">
            <div className="text-2xl font-black text-[#493129]">{dateInfo.day}</div>
            <div className="text-xs font-bold text-[#8b597b] uppercase">{dateInfo.month}</div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => toggleLike(event._id)}
              className={`p-2 rounded-full transition-all ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all">
              <Share2 size={18} />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/80 text-sm font-bold mb-2">
              <Star size={16} className="text-yellow-400" />
              <span>{event.clubName || 'Campus Club'}</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6">
          <h3 className="text-xl font-black text-[#493129] mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-[#493129]/60 text-sm font-medium mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-[#493129]/80">
              <Clock size={16} className="text-[#8b597b]" />
              <span className="text-sm font-bold">
                {new Date(event.date).toLocaleDateString()} • {event.time || '6:00 PM'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#493129]/80">
              <MapPin size={16} className="text-[#8b597b]" />
              <span className="text-sm font-bold">{event.venue || 'Main Auditorium'}</span>
            </div>
            <div className="flex items-center gap-3 text-[#493129]/80">
              <Users size={16} className="text-[#8b597b]" />
              <span className="text-sm font-bold">{event.expectedAttendees || 100} expected</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#efa3a0]/20 text-[#8b597b] px-3 py-1 rounded-full text-xs font-bold uppercase">
                {event.category || 'General'}
              </span>
              {event.isPopular && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Popular
                </span>
              )}
            </div>
            <button className="bg-[#8b597b] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors flex items-center gap-2">
              <Ticket size={16} />
              Register
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffeadb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8b597b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffeadb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#efa3a0] animate-pulse"></div>
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Campus Events</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
            Discover <span className="text-[#8b597b]">Events</span>
          </h1>
          <p className="text-[#493129]/60 font-bold text-lg">Find and join exciting campus activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-8 border border-[#ffeadb] shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#493129]/40" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-[#8b597b] text-white px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer focus:outline-none focus:bg-[#493129] transition-colors pr-10"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
            </div>

            <button className="bg-[#efa3a0] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#8b597b] transition-colors flex items-center gap-2">
              <Filter size={16} />
              More Filters
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-[#493129]/30 mb-6" />
            <h3 className="text-2xl font-black text-[#493129] mb-4">No Events Found</h3>
            <p className="text-[#493129]/60 font-bold mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No events are currently available'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-[#8b597b] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#493129] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEvents;