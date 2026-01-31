import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  MoreVertical,
  Search,
  Users,
  Settings,
  Bell,
  Image as ImageIcon,
  File,
  Mic,
  Plus
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const ClubChat = () => {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [onlineMembers, setOnlineMembers] = useState([]);
  const messagesEndRef = useRef(null);

  // Mock data - replace with real WebSocket connection
  useEffect(() => {
    const mockMessages = {
      general: [
        {
          id: 1,
          sender: 'Sarah Johnson',
          message: 'Hey everyone! Don\'t forget about our meeting tomorrow at 3 PM.',
          timestamp: '2024-01-15T10:30:00Z',
          type: 'text',
          isOwn: false
        },
        {
          id: 2,
          sender: 'You',
          message: 'Thanks for the reminder! I\'ll be there.',
          timestamp: '2024-01-15T10:32:00Z',
          type: 'text',
          isOwn: true
        },
        {
          id: 3,
          sender: 'Mike Chen',
          message: 'Should we prepare anything specific for the meeting?',
          timestamp: '2024-01-15T10:35:00Z',
          type: 'text',
          isOwn: false
        },
        {
          id: 4,
          sender: 'Sarah Johnson',
          message: 'Yes, please bring your event proposals and budget estimates.',
          timestamp: '2024-01-15T10:37:00Z',
          type: 'text',
          isOwn: false
        },
        {
          id: 5,
          sender: 'You',
          message: 'I\'ve uploaded the budget spreadsheet to our shared drive.',
          timestamp: '2024-01-15T10:40:00Z',
          type: 'text',
          isOwn: true
        }
      ],
      events: [
        {
          id: 1,
          sender: 'Alex Rodriguez',
          message: 'The venue booking for Tech Fest has been confirmed!',
          timestamp: '2024-01-15T09:15:00Z',
          type: 'text',
          isOwn: false
        },
        {
          id: 2,
          sender: 'You',
          message: 'Awesome! What about the sound equipment?',
          timestamp: '2024-01-15T09:17:00Z',
          type: 'text',
          isOwn: true
        }
      ],
      announcements: [
        {
          id: 1,
          sender: 'Club Admin',
          message: 'New club guidelines have been posted. Please review them by Friday.',
          timestamp: '2024-01-14T16:00:00Z',
          type: 'announcement',
          isOwn: false
        }
      ]
    };

    const mockOnlineMembers = [
      { id: 1, name: 'Sarah Johnson', role: 'President', avatar: 'SJ', status: 'online' },
      { id: 2, name: 'Mike Chen', role: 'Vice President', avatar: 'MC', status: 'online' },
      { id: 3, name: 'Alex Rodriguez', role: 'Secretary', avatar: 'AR', status: 'away' },
      { id: 4, name: 'Emma Davis', role: 'Treasurer', avatar: 'ED', status: 'offline' },
      { id: 5, name: 'You', role: 'Member', avatar: user?.name?.split(' ').map(n => n[0]).join('') || 'U', status: 'online' }
    ];

    setMessages(mockMessages);
    setOnlineMembers(mockOnlineMembers);
  }, [user]);

  const channels = [
    { id: 'general', name: 'General', icon: '💬', unread: 0 },
    { id: 'events', name: 'Events', icon: '📅', unread: 2 },
    { id: 'announcements', name: 'Announcements', icon: '📢', unread: 1 },
    { id: 'resources', name: 'Resources', icon: '📁', unread: 0 }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChannel]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      isOwn: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [...(prev[selectedChannel] || []), newMessage]
    }));

    setMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const MessageBubble = ({ msg }) => (
    <div className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${msg.isOwn ? 'order-2' : 'order-1'}`}>
        {!msg.isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-[#8b597b] text-white text-xs font-bold flex items-center justify-center">
              {msg.sender.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-xs font-bold text-[#493129]/60">{msg.sender}</span>
            <span className="text-xs text-[#493129]/40">{formatTime(msg.timestamp)}</span>
          </div>
        )}
        <div className={`p-4 rounded-2xl ${
          msg.isOwn 
            ? 'bg-[#8b597b] text-white rounded-tr-md' 
            : msg.type === 'announcement'
              ? 'bg-[#efa3a0]/20 text-[#493129] border border-[#efa3a0]/30 rounded-tl-md'
              : 'bg-white text-[#493129] border border-[#ffeadb] rounded-tl-md'
        }`}>
          <p className="font-medium leading-relaxed">{msg.message}</p>
          {msg.isOwn && (
            <div className="text-right mt-1">
              <span className="text-xs text-white/60">{formatTime(msg.timestamp)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ffeadb] flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-[#ffeadb] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#ffeadb]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-[#493129]">Club Chat</h2>
            <button className="p-2 rounded-xl hover:bg-[#ffeadb] transition-colors">
              <Settings size={20} className="text-[#493129]" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#493129]/40" size={16} />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-[#ffeadb] border border-[#ffdec7] rounded-xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors text-sm"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-black text-[#493129]/60 uppercase tracking-wide mb-3">Channels</h3>
            <div className="space-y-1">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                    selectedChannel === channel.id
                      ? 'bg-[#8b597b] text-white'
                      : 'hover:bg-[#ffeadb] text-[#493129]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{channel.icon}</span>
                    <span className="font-bold text-sm">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      selectedChannel === channel.id
                        ? 'bg-white/20 text-white'
                        : 'bg-[#efa3a0] text-white'
                    }`}>
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Online Members */}
          <div className="p-4 border-t border-[#ffeadb]">
            <h3 className="text-sm font-black text-[#493129]/60 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Users size={14} />
              Online Members ({onlineMembers.filter(m => m.status === 'online').length})
            </h3>
            <div className="space-y-2">
              {onlineMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#ffeadb] transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#8b597b] text-white text-xs font-bold flex items-center justify-center">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#493129] truncate">{member.name}</p>
                    <p className="text-xs text-[#493129]/60">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-[#ffeadb] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{channels.find(c => c.id === selectedChannel)?.icon}</span>
              <div>
                <h2 className="text-xl font-black text-[#493129]">
                  {channels.find(c => c.id === selectedChannel)?.name}
                </h2>
                <p className="text-sm text-[#493129]/60 font-bold">
                  {onlineMembers.filter(m => m.status === 'online').length} members online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-[#ffeadb] transition-colors">
                <Phone size={20} className="text-[#493129]" />
              </button>
              <button className="p-2 rounded-xl hover:bg-[#ffeadb] transition-colors">
                <Video size={20} className="text-[#493129]" />
              </button>
              <button className="p-2 rounded-xl hover:bg-[#ffeadb] transition-colors">
                <Bell size={20} className="text-[#493129]" />
              </button>
              <button className="p-2 rounded-xl hover:bg-[#ffeadb] transition-colors">
                <MoreVertical size={20} className="text-[#493129]" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#ffeadb]">
          <div className="max-w-4xl mx-auto">
            {(messages[selectedChannel] || []).map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-[#ffeadb] p-6">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name.toLowerCase()}`}
                  className="w-full p-4 pr-20 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium resize-none"
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 rounded-xl hover:bg-[#ffdec7] transition-colors"
                  >
                    <Paperclip size={18} className="text-[#493129]/60" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-xl hover:bg-[#ffdec7] transition-colors"
                  >
                    <ImageIcon size={18} className="text-[#493129]/60" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-xl hover:bg-[#ffdec7] transition-colors"
                  >
                    <Smile size={18} className="text-[#493129]/60" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-[#8b597b] text-white p-4 rounded-2xl hover:bg-[#493129] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClubChat;