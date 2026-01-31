import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import eventService from '../../services/event.service';
import useAuth from '../../hooks/useAuth';

const ClubRequest = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusFilters = [
    { value: 'all', label: 'All Requests' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, filterStatus, searchTerm]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await eventService.getAllEvents();
      if (result.success) {
        // Filter requests for current user's club
        const userRequests = (result.data || []).filter(event => 
          event.submittedBy === user?._id || event.clubName === user?.clubName
        );
        setRequests(userRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt));

    setFilteredRequests(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const RequestCard = ({ request }) => {
    const StatusIcon = getStatusIcon(request.status);

    return (
      <div className="bg-white rounded-[2rem] p-6 border border-[#ffeadb] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-black text-[#493129] mb-2 line-clamp-1">{request.title}</h3>
            <p className="text-[#493129]/60 text-sm line-clamp-2 mb-3">{request.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(request.status)}`}>
              <StatusIcon size={14} />
              {request.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-[#493129]/80">
            <Calendar size={16} className="text-[#8b597b]" />
            <span className="font-bold">{new Date(request.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-[#493129]/80">
            <MapPin size={16} className="text-[#8b597b]" />
            <span className="font-bold">{request.venue || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-[#493129]/80">
            <Users size={16} className="text-[#8b597b]" />
            <span className="font-bold">{request.expectedAttendees || 0} attendees</span>
          </div>
          <div className="flex items-center gap-2 text-[#493129]/80">
            <Clock size={16} className="text-[#8b597b]" />
            <span className="font-bold">{request.time || 'TBD'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#ffeadb]">
          <div className="text-xs text-[#493129]/60 font-bold">
            Submitted {new Date(request.createdAt || request.submittedAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedRequest(request)}
              className="bg-[#ffeadb] text-[#493129] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#ffdec7] transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              View
            </button>
            {request.status === 'pending' && (
              <>
                <button className="bg-[#8b597b] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors flex items-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors flex items-center gap-2">
                  <Trash2 size={16} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RequestModal = ({ request, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-[#493129] mb-2">{request.title}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(request.status)}`}>
                  {request.status?.toUpperCase()}
                </span>
                <span className="text-[#493129]/60 text-sm font-bold">
                  Submitted {new Date(request.createdAt || request.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#ffeadb] transition-colors"
            >
              <XCircle size={24} className="text-[#493129]" />
            </button>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Event Date</label>
                <p className="text-[#493129]/80 font-bold">{new Date(request.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Time</label>
                <p className="text-[#493129]/80 font-bold">{request.time || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Venue</label>
                <p className="text-[#493129]/80 font-bold">{request.venue || 'Not specified'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Expected Attendees</label>
                <p className="text-[#493129]/80 font-bold">{request.expectedAttendees || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Category</label>
                <p className="text-[#493129]/80 font-bold">{request.category || 'General'}</p>
              </div>
              <div>
                <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Budget</label>
                <p className="text-[#493129]/80 font-bold">${request.budget || 0}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Description</label>
            <div className="mt-2 p-4 bg-[#ffeadb] rounded-2xl">
              <p className="text-[#493129]/80 font-medium leading-relaxed">{request.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {request.requirements && (
            <div className="mb-6">
              <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Special Requirements</label>
              <div className="mt-2 p-4 bg-[#ffeadb] rounded-2xl">
                <p className="text-[#493129]/80 font-medium leading-relaxed">{request.requirements}</p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-6">
            <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Contact Information</label>
            <div className="mt-2 p-4 bg-[#ffeadb] rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-[#8b597b] uppercase">Contact Person</span>
                  <p className="text-[#493129] font-bold">{request.contactPerson || user?.name}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#8b597b] uppercase">Email</span>
                  <p className="text-[#493129] font-bold">{request.contactEmail || user?.email}</p>
                </div>
                {request.contactPhone && (
                  <div>
                    <span className="text-xs font-bold text-[#8b597b] uppercase">Phone</span>
                    <p className="text-[#493129] font-bold">{request.contactPhone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Comments */}
          {request.adminComments && (
            <div className="mb-6">
              <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Admin Comments</label>
              <div className="mt-2 p-4 bg-[#8b597b]/10 rounded-2xl border-l-4 border-[#8b597b]">
                <p className="text-[#493129]/80 font-medium leading-relaxed">{request.adminComments}</p>
              </div>
            </div>
          )}

          {/* Status-specific Actions */}
          {request.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-yellow-600" size={20} />
                <h3 className="text-lg font-black text-yellow-800">Pending Review</h3>
              </div>
              <p className="text-yellow-700 font-medium mb-4">
                Your request is currently under review by the administration. You will be notified once a decision is made.
              </p>
              <div className="flex gap-3">
                <button className="bg-[#8b597b] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors">
                  Edit Request
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">
                  Cancel Request
                </button>
              </div>
            </div>
          )}

          {request.status === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="text-green-600" size={20} />
                <h3 className="text-lg font-black text-green-800">Request Approved</h3>
              </div>
              <p className="text-green-700 font-medium mb-4">
                Congratulations! Your event request has been approved. You can now proceed with your event planning.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
                View Event Details
              </button>
            </div>
          )}

          {request.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="text-red-600" size={20} />
                <h3 className="text-lg font-black text-red-800">Request Rejected</h3>
              </div>
              <p className="text-red-700 font-medium mb-4">
                Unfortunately, your event request has been rejected. Please review the admin comments and consider submitting a revised proposal.
              </p>
              <button className="bg-[#8b597b] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors">
                Submit New Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
            <div className="w-3 h-3 rounded-full bg-[#8b597b] animate-pulse"></div>
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Request Management</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
                My <span className="text-[#8b597b]">Requests</span>
              </h1>
              <p className="text-[#493129]/60 font-bold text-lg">Track and manage your event proposals</p>
            </div>
            <button className="bg-[#8b597b] text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#493129] transition-colors flex items-center gap-2 shadow-lg">
              <Plus size={20} />
              New Request
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-8 border border-[#ffeadb] shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                    filterStatus === filter.value
                      ? 'bg-[#8b597b] text-white'
                      : 'bg-[#ffeadb] text-[#493129] hover:bg-[#ffdec7]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#493129]/40" size={20} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
              />
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-[#493129]/30 mb-6" />
            <h3 className="text-2xl font-black text-[#493129] mb-4">No Requests Found</h3>
            <p className="text-[#493129]/60 font-bold mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'You haven\'t submitted any event requests yet'}
            </p>
            <button className="bg-[#8b597b] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#493129] transition-colors flex items-center gap-2 mx-auto">
              <Plus size={20} />
              Create Your First Request
            </button>
          </div>
        )}

        {/* Request Detail Modal */}
        {selectedRequest && (
          <RequestModal 
            request={selectedRequest} 
            onClose={() => setSelectedRequest(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default ClubRequest;