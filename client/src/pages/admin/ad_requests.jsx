import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  FileText,
  Eye,
  Filter,
  Search,
  ChevronDown,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import eventService from '../../services/event.service';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const statusFilters = [
    { value: 'all', label: 'All Requests', count: 0 },
    { value: 'pending', label: 'Pending', count: 0 },
    { value: 'approved', label: 'Approved', count: 0 },
    { value: 'rejected', label: 'Rejected', count: 0 }
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
        setRequests(result.data || []);
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
        request.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (requestId, newStatus, comments = '') => {
    setActionLoading(requestId);
    try {
      const result = await eventService.updateEventStatus(requestId, newStatus, comments);
      if (result.success) {
        // Update local state
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId 
              ? { ...req, status: newStatus, adminComments: comments }
              : req
          )
        );
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(null);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      default: return AlertTriangle;
    }
  };

  const getPriorityLevel = (request) => {
    const eventDate = new Date(request.date);
    const today = new Date();
    const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEvent <= 7) return 'high';
    if (daysUntilEvent <= 14) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Update status filter counts
  const updatedStatusFilters = statusFilters.map(filter => ({
    ...filter,
    count: filter.value === 'all' 
      ? requests.length 
      : requests.filter(req => req.status === filter.value).length
  }));

  const RequestCard = ({ request }) => {
    const StatusIcon = getStatusIcon(request.status);
    const priority = getPriorityLevel(request);

    return (
      <div className="bg-white rounded-[2rem] p-6 border border-[#ffeadb] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-black text-[#493129] line-clamp-1">{request.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(priority)}`}>
                {priority.toUpperCase()}
              </span>
            </div>
            <p className="text-[#8b597b] font-bold text-sm mb-2">{request.clubName}</p>
            <p className="text-[#493129]/60 text-sm line-clamp-2">{request.description}</p>
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
            <DollarSign size={16} className="text-[#8b597b]" />
            <span className="font-bold">${request.budget || 0}</span>
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
              Review
            </button>
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate(request._id, 'approved')}
                  disabled={actionLoading === request._id}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(request._id, 'rejected')}
                  disabled={actionLoading === request._id}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RequestModal = ({ request, onClose }) => {
    const [comments, setComments] = useState('');
    const [action, setAction] = useState('');

    const handleAction = async () => {
      if (action) {
        await handleStatusUpdate(request._id, action, comments);
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-[#493129] mb-2">{request.title}</h2>
                <p className="text-[#8b597b] font-bold">{request.clubName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#ffeadb] transition-colors"
              >
                <XCircle size={24} className="text-[#493129]" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Event Date</label>
                  <p className="text-[#493129]/80 font-bold">{new Date(request.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Venue</label>
                  <p className="text-[#493129]/80 font-bold">{request.venue || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Expected Attendees</label>
                  <p className="text-[#493129]/80 font-bold">{request.expectedAttendees || 'Not specified'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Category</label>
                  <p className="text-[#493129]/80 font-bold">{request.category || 'General'}</p>
                </div>
                <div>
                  <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Budget</label>
                  <p className="text-[#493129]/80 font-bold">${request.budget || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Contact</label>
                  <p className="text-[#493129]/80 font-bold">{request.contactEmail}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Description</label>
              <p className="text-[#493129]/80 font-medium mt-2 leading-relaxed">{request.description}</p>
            </div>

            {/* Requirements */}
            {request.requirements && (
              <div className="mb-6">
                <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Special Requirements</label>
                <p className="text-[#493129]/80 font-medium mt-2 leading-relaxed">{request.requirements}</p>
              </div>
            )}

            {/* Admin Actions */}
            {request.status === 'pending' && (
              <div className="bg-[#ffeadb] rounded-2xl p-6">
                <h3 className="text-xl font-black text-[#493129] mb-4">Admin Action</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-black text-[#493129] uppercase tracking-wide">Comments (Optional)</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      className="w-full mt-2 p-3 bg-white border border-[#ffdec7] rounded-xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium resize-none"
                      placeholder="Add comments for the club leader..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setAction('approved');
                        handleAction();
                      }}
                      disabled={actionLoading === request._id}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={20} />
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        setAction('rejected');
                        handleAction();
                      }}
                      disabled={actionLoading === request._id}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={20} />
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Comments */}
            {request.adminComments && (
              <div className="mt-6 bg-[#ffeadb] rounded-2xl p-6">
                <h3 className="text-lg font-black text-[#493129] mb-2">Admin Comments</h3>
                <p className="text-[#493129]/80 font-medium">{request.adminComments}</p>
              </div>
            )}
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
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Request Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
            Event <span className="text-[#8b597b]">Requests</span>
          </h1>
          <p className="text-[#493129]/60 font-bold text-lg">Review and manage event proposals from clubs</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-8 border border-[#ffeadb] shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              {updatedStatusFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${
                    filterStatus === filter.value
                      ? 'bg-[#8b597b] text-white'
                      : 'bg-[#ffeadb] text-[#493129] hover:bg-[#ffdec7]'
                  }`}
                >
                  {filter.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === filter.value
                      ? 'bg-white/20 text-white'
                      : 'bg-[#8b597b]/20 text-[#8b597b]'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#493129]/40" size={20} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
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
            <FileText size={64} className="mx-auto text-[#493129]/30 mb-6" />
            <h3 className="text-2xl font-black text-[#493129] mb-4">No Requests Found</h3>
            <p className="text-[#493129]/60 font-bold">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No event requests have been submitted yet'}
            </p>
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

export default AdminRequests;