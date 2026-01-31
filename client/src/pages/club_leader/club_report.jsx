import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Calendar, 
  DollarSign,
  Users,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Receipt
} from 'lucide-react';
import eventService from '../../services/event.service';
import useAuth from '../../hooks/useAuth';

const ClubReport = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        eventTitle: 'Tech Fest 2024',
        eventDate: '2024-01-15',
        submittedDate: '2024-01-20',
        status: 'submitted',
        attendees: 250,
        budget: 5000,
        actualSpent: 4750,
        description: 'The Tech Fest was a huge success with over 250 attendees. We had 15 speakers, 8 workshops, and 3 competitions.',
        highlights: [
          'Record attendance of 250+ students',
          'Successful partnership with 5 tech companies',
          '95% positive feedback from attendees',
          'Generated $2000 in sponsorship revenue'
        ],
        challenges: [
          'Audio issues in the main auditorium during the first hour',
          'Parking shortage due to higher than expected attendance',
          'Catering ran out 30 minutes before the end'
        ],
        photos: [
          'https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80'
        ],
        receipts: ['receipt_1.pdf', 'receipt_2.pdf'],
        feedback: {
          rating: 4.5,
          responses: 180,
          comments: [
            'Great event! Learned a lot from the workshops.',
            'Amazing speakers and networking opportunities.',
            'Could use better organization for food distribution.'
          ]
        }
      },
      {
        id: 2,
        eventTitle: 'Cultural Night',
        eventDate: '2024-01-10',
        submittedDate: '2024-01-12',
        status: 'approved',
        attendees: 180,
        budget: 3000,
        actualSpent: 2850,
        description: 'A vibrant celebration of cultural diversity with performances, food, and art exhibitions.',
        highlights: [
          '12 cultural performances',
          'Food stalls from 8 different countries',
          'Art exhibition with 25 student artists',
          'Live music and dance performances'
        ],
        challenges: [
          'Weather concerns for outdoor setup',
          'Coordination between multiple cultural groups'
        ],
        photos: [
          'https://images.unsplash.com/photo-1459749411177-042180ceea72?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80'
        ],
        receipts: ['cultural_receipt_1.pdf'],
        feedback: {
          rating: 4.8,
          responses: 145,
          comments: [
            'Loved the diversity and performances!',
            'Food was amazing, great variety.',
            'Well organized and fun event.'
          ]
        }
      },
      {
        id: 3,
        eventTitle: 'Workshop Series',
        eventDate: '2024-01-05',
        submittedDate: null,
        status: 'pending',
        attendees: 75,
        budget: 1500,
        actualSpent: 1450,
        description: 'Three-day workshop series on web development, data science, and entrepreneurship.',
        highlights: [
          'High engagement in all sessions',
          'Practical hands-on learning',
          'Industry expert speakers'
        ],
        challenges: [
          'Limited lab space for hands-on sessions',
          'Some technical difficulties with projectors'
        ],
        photos: [],
        receipts: [],
        feedback: {
          rating: 4.3,
          responses: 65,
          comments: []
        }
      }
    ];
    setReports(mockReports);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'submitted': return FileText;
      case 'pending': return Clock;
      case 'rejected': return AlertCircle;
      default: return FileText;
    }
  };

  const ReportCard = ({ report }) => {
    const StatusIcon = getStatusIcon(report.status);
    const budgetUtilization = ((report.actualSpent / report.budget) * 100).toFixed(1);

    return (
      <div className="bg-white rounded-[2rem] p-6 border border-[#ffeadb] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-black text-[#493129] mb-2">{report.eventTitle}</h3>
            <p className="text-[#493129]/60 text-sm mb-3 line-clamp-2">{report.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(report.status)}`}>
            <StatusIcon size={14} />
            {report.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-[#493129]/80">
            <Calendar size={16} className="text-[#8b597b]" />
            <span className="font-bold text-sm">{new Date(report.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-[#493129]/80">
            <Users size={16} className="text-[#8b597b]" />
            <span className="font-bold text-sm">{report.attendees} attendees</span>
          </div>
          <div className="flex items-center gap-2 text-[#493129]/80">
            <DollarSign size={16} className="text-[#8b597b]" />
            <span className="font-bold text-sm">${report.actualSpent} / ${report.budget}</span>
          </div>
          <div className="flex items-center gap-2 text-[#493129]/80">
            <Camera size={16} className="text-[#8b597b]" />
            <span className="font-bold text-sm">{report.photos.length} photos</span>
          </div>
        </div>

        {/* Budget Utilization Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#493129]/60 uppercase">Budget Utilization</span>
            <span className="text-xs font-bold text-[#8b597b]">{budgetUtilization}%</span>
          </div>
          <div className="w-full bg-[#ffeadb] rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                budgetUtilization > 100 ? 'bg-red-500' : 
                budgetUtilization > 90 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#ffeadb]">
          <div className="text-xs text-[#493129]/60 font-bold">
            {report.submittedDate 
              ? `Submitted ${new Date(report.submittedDate).toLocaleDateString()}`
              : 'Not submitted yet'
            }
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedReport(report)}
              className="bg-[#ffeadb] text-[#493129] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#ffdec7] transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              View
            </button>
            {report.status === 'pending' && (
              <button className="bg-[#8b597b] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#493129] transition-colors flex items-center gap-2">
                <Edit size={16} />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ReportModal = ({ report, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-[#493129] mb-2">{report.eventTitle}</h2>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(report.status)}`}>
                  {report.status.toUpperCase()}
                </span>
                <span className="text-[#493129]/60 text-sm font-bold">
                  Event Date: {new Date(report.eventDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#ffeadb] transition-colors"
            >
              <AlertCircle size={24} className="text-[#493129]" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#ffeadb] rounded-2xl p-6 text-center">
              <Users className="mx-auto text-[#8b597b] mb-2" size={32} />
              <div className="text-2xl font-black text-[#493129]">{report.attendees}</div>
              <div className="text-sm font-bold text-[#493129]/60 uppercase">Attendees</div>
            </div>
            <div className="bg-[#ffeadb] rounded-2xl p-6 text-center">
              <DollarSign className="mx-auto text-[#8b597b] mb-2" size={32} />
              <div className="text-2xl font-black text-[#493129]">${report.actualSpent}</div>
              <div className="text-sm font-bold text-[#493129]/60 uppercase">Spent</div>
            </div>
            <div className="bg-[#ffeadb] rounded-2xl p-6 text-center">
              <Camera className="mx-auto text-[#8b597b] mb-2" size={32} />
              <div className="text-2xl font-black text-[#493129]">{report.photos.length}</div>
              <div className="text-sm font-bold text-[#493129]/60 uppercase">Photos</div>
            </div>
            <div className="bg-[#ffeadb] rounded-2xl p-6 text-center">
              <FileText className="mx-auto text-[#8b597b] mb-2" size={32} />
              <div className="text-2xl font-black text-[#493129]">{report.feedback.rating}</div>
              <div className="text-sm font-bold text-[#493129]/60 uppercase">Rating</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-black text-[#493129] mb-4">Event Summary</h3>
            <div className="bg-[#ffeadb] rounded-2xl p-6">
              <p className="text-[#493129] font-medium leading-relaxed">{report.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Highlights */}
            <div>
              <h3 className="text-xl font-black text-[#493129] mb-4">Highlights</h3>
              <div className="space-y-3">
                {report.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                    <CheckCircle className="text-green-600 mt-0.5" size={16} />
                    <p className="text-green-800 font-medium text-sm">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="text-xl font-black text-[#493129] mb-4">Challenges</h3>
              <div className="space-y-3">
                {report.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                    <p className="text-yellow-800 font-medium text-sm">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          {report.photos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-black text-[#493129] mb-4">Event Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {report.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden border border-[#ffeadb]">
                    <img src={photo} alt={`Event photo ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="mb-8">
            <h3 className="text-xl font-black text-[#493129] mb-4">Attendee Feedback</h3>
            <div className="bg-[#ffeadb] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-black text-[#493129]">{report.feedback.rating}/5</div>
                <div>
                  <div className="text-sm font-bold text-[#493129]/60 uppercase">Average Rating</div>
                  <div className="text-sm text-[#493129]/80">{report.feedback.responses} responses</div>
                </div>
              </div>
              {report.feedback.comments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[#493129]">Sample Comments:</h4>
                  {report.feedback.comments.map((comment, index) => (
                    <div key={index} className="bg-white p-3 rounded-xl border border-[#ffdec7]">
                      <p className="text-[#493129] text-sm italic">"{comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Receipts */}
          {report.receipts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-black text-[#493129] mb-4">Financial Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.receipts.map((receipt, index) => (
                  <div key={index} className="flex items-center gap-3 bg-[#ffeadb] p-4 rounded-xl">
                    <Receipt className="text-[#8b597b]" size={24} />
                    <div className="flex-1">
                      <p className="font-bold text-[#493129]">{receipt}</p>
                      <p className="text-sm text-[#493129]/60">PDF Document</p>
                    </div>
                    <button className="bg-[#8b597b] text-white p-2 rounded-xl hover:bg-[#493129] transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {report.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="text-lg font-black text-yellow-800 mb-4">Complete Your Report</h3>
              <p className="text-yellow-700 font-medium mb-4">
                Your report is ready to submit. Make sure all information is accurate before submitting.
              </p>
              <div className="flex gap-3">
                <button className="bg-[#8b597b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#493129] transition-colors">
                  Submit Report
                </button>
                <button className="bg-white text-[#493129] px-6 py-3 rounded-xl font-bold border border-[#ffdec7] hover:bg-[#ffeadb] transition-colors">
                  Save Draft
                </button>
              </div>
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
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Event Reports</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
                Event <span className="text-[#8b597b]">Reports</span>
              </h1>
              <p className="text-[#493129]/60 font-bold text-lg">Document and share your event outcomes</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#8b597b] text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#493129] transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              New Report
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FileText size={64} className="mx-auto text-[#493129]/30 mb-6" />
            <h3 className="text-2xl font-black text-[#493129] mb-4">No Reports Yet</h3>
            <p className="text-[#493129]/60 font-bold mb-6">
              Create your first event report to document outcomes and share insights
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#8b597b] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#493129] transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create Your First Report
            </button>
          </div>
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <ReportModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default ClubReport;