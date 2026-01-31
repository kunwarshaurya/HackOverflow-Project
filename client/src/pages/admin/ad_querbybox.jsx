import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  Eye,
  Reply,
  Archive,
  Star
} from 'lucide-react';

const AdminQueryBox = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockQueries = [
      {
        id: 1,
        subject: "Venue Booking Issue",
        message: "I'm having trouble booking the main auditorium for our tech fest. The system shows it's available but won't let me complete the booking.",
        senderName: "Sarah Johnson",
        senderEmail: "sarah.johnson@university.edu",
        senderPhone: "+1 (555) 123-4567",
        senderRole: "club_leader",
        category: "technical",
        status: "pending",
        priority: "high",
        createdAt: "2024-01-15T10:30:00Z",
        replies: []
      },
      {
        id: 2,
        subject: "Budget Approval Delay",
        message: "Our event proposal was approved 2 weeks ago, but we haven't received budget approval yet. The event is scheduled for next month.",
        senderName: "Mike Chen",
        senderEmail: "mike.chen@university.edu",
        senderPhone: "+1 (555) 987-6543",
        senderRole: "club_leader",
        category: "financial",
        status: "in_progress",
        priority: "medium",
        createdAt: "2024-01-12T14:20:00Z",
        replies: [
          {
            id: 1,
            message: "We're reviewing your budget request. You should hear back within 3 business days.",
            sender: "Admin",
            timestamp: "2024-01-13T09:15:00Z"
          }
        ]
      },
      {
        id: 3,
        subject: "Equipment Request",
        message: "We need additional sound equipment for our cultural night. The current setup won't be sufficient for our expected audience size.",
        senderName: "Priya Patel",
        senderEmail: "priya.patel@university.edu",
        senderPhone: "+1 (555) 456-7890",
        senderRole: "student",
        category: "equipment",
        status: "resolved",
        priority: "low",
        createdAt: "2024-01-10T16:45:00Z",
        replies: [
          {
            id: 1,
            message: "Additional sound equipment has been arranged. Please contact the AV team at ext. 2345.",
            sender: "Admin",
            timestamp: "2024-01-11T11:30:00Z"
          }
        ]
      },
      {
        id: 4,
        subject: "Event Cancellation Policy",
        message: "What is the policy for cancelling events due to weather conditions? Our outdoor sports event might need to be postponed.",
        senderName: "David Wilson",
        senderEmail: "david.wilson@university.edu",
        senderPhone: "+1 (555) 321-0987",
        senderRole: "club_leader",
        category: "policy",
        status: "pending",
        priority: "medium",
        createdAt: "2024-01-14T08:15:00Z",
        replies: []
      }
    ];
    setQueries(mockQueries);
  }, []);

  useEffect(() => {
    filterQueries();
  }, [queries, filterStatus, filterCategory, searchTerm]);

  const filterQueries = () => {
    let filtered = queries;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(query => query.status === filterStatus);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(query => query.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(query =>
        query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.senderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredQueries(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'policy': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (queryId, newStatus) => {
    setQueries(prev => 
      prev.map(query => 
        query.id === queryId 
          ? { ...query, status: newStatus }
          : query
      )
    );
  };

  const handleReply = async (queryId) => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      const newReply = {
        id: Date.now(),
        message: replyText,
        sender: "Admin",
        timestamp: new Date().toISOString()
      };

      setQueries(prev => 
        prev.map(query => 
          query.id === queryId 
            ? { 
                ...query, 
                replies: [...query.replies, newReply],
                status: 'in_progress'
              }
            : query
        )
      );

      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technical', label: 'Technical' },
    { value: 'financial', label: 'Financial' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'policy', label: 'Policy' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const QueryCard = ({ query }) => (
    <div 
      className="bg-white rounded-[2rem] p-6 border border-[#ffeadb] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => setSelectedQuery(query)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-black text-[#493129] line-clamp-1">{query.subject}</h3>
            {query.priority === 'high' && <Star className="text-red-500" size={16} />}
          </div>
          <p className="text-[#493129]/60 text-sm line-clamp-2 mb-3">{query.message}</p>
          <div className="flex items-center gap-2 text-sm text-[#493129]/80">
            <User size={14} />
            <span className="font-bold">{query.senderName}</span>
            <span className="text-[#493129]/40">•</span>
            <span>{new Date(query.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(query.category)}`}>
            {query.category.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(query.priority)}`}>
            {query.priority.toUpperCase()}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(query.status)}`}>
          {query.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {query.replies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#ffeadb]">
          <div className="flex items-center gap-2 text-sm text-[#8b597b]">
            <Reply size={14} />
            <span className="font-bold">{query.replies.length} replies</span>
          </div>
        </div>
      )}
    </div>
  );

  const QueryModal = ({ query, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-black text-[#493129]">{query.subject}</h2>
                {query.priority === 'high' && <Star className="text-red-500" size={24} />}
              </div>
              <div className="flex items-center gap-4 text-sm text-[#493129]/80">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-bold">{query.senderName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#ffeadb] transition-colors"
            >
              <AlertCircle size={24} className="text-[#493129]" />
            </button>
          </div>

          {/* Sender Info */}
          <div className="bg-[#ffeadb] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-black text-[#493129] mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#8b597b]" />
                <span className="text-[#493129] font-medium">{query.senderEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#8b597b]" />
                <span className="text-[#493129] font-medium">{query.senderPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-[#8b597b]" />
                <span className="text-[#493129] font-medium">{query.senderRole.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Original Message */}
          <div className="mb-6">
            <h3 className="text-lg font-black text-[#493129] mb-3">Original Message</h3>
            <div className="bg-[#ffeadb] rounded-2xl p-6">
              <p className="text-[#493129] font-medium leading-relaxed">{query.message}</p>
            </div>
          </div>

          {/* Replies */}
          {query.replies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-black text-[#493129] mb-3">Conversation</h3>
              <div className="space-y-4">
                {query.replies.map((reply) => (
                  <div key={reply.id} className="bg-[#8b597b]/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#8b597b]">{reply.sender}</span>
                      <span className="text-sm text-[#493129]/60">
                        {new Date(reply.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#493129] font-medium">{reply.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Section */}
          <div className="bg-[#ffeadb] rounded-2xl p-6">
            <h3 className="text-lg font-black text-[#493129] mb-4">Send Reply</h3>
            <div className="space-y-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                className="w-full p-4 bg-white border border-[#ffdec7] rounded-xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium resize-none"
                placeholder="Type your reply..."
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(query.id, 'in_progress')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(query.id, 'resolved')}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
                <button
                  onClick={() => handleReply(query.id)}
                  disabled={!replyText.trim() || loading}
                  className="bg-[#8b597b] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send size={16} />
                  )}
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ffeadb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#efa3a0] animate-pulse"></div>
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Query Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
            Query <span className="text-[#8b597b]">Box</span>
          </h1>
          <p className="text-[#493129]/60 font-bold text-lg">Manage and respond to user queries and support requests</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-8 border border-[#ffeadb] shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#493129]/40" size={20} />
              <input
                type="text"
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#8b597b] text-white px-4 py-3 rounded-2xl font-bold text-sm cursor-pointer focus:outline-none focus:bg-[#493129] transition-colors"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#efa3a0] text-white px-4 py-3 rounded-2xl font-bold text-sm cursor-pointer focus:outline-none focus:bg-[#8b597b] transition-colors"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Queries Grid */}
        {filteredQueries.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQueries.map((query) => (
              <QueryCard key={query.id} query={query} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MessageSquare size={64} className="mx-auto text-[#493129]/30 mb-6" />
            <h3 className="text-2xl font-black text-[#493129] mb-4">No Queries Found</h3>
            <p className="text-[#493129]/60 font-bold">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'No queries have been submitted yet'}
            </p>
          </div>
        )}

        {/* Query Detail Modal */}
        {selectedQuery && (
          <QueryModal 
            query={selectedQuery} 
            onClose={() => setSelectedQuery(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminQueryBox;