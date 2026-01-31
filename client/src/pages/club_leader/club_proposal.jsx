import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  Upload,
  Send,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import eventService from '../../services/event.service';
import useAuth from '../../hooks/useAuth';

const ClubProposal = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    expectedAttendees: '',
    budget: '',
    category: 'academic',
    requirements: '',
    contactPerson: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'technical', label: 'Technical' },
    { value: 'sports', label: 'Sports' },
    { value: 'social', label: 'Social' },
    { value: 'workshop', label: 'Workshop' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const proposalData = {
        ...formData,
        clubName: user?.clubName || 'Student Club',
        status: 'pending',
        submittedBy: user?._id,
        submittedAt: new Date().toISOString()
      };

      const result = await eventService.createEvent(proposalData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Proposal submitted successfully! You will receive updates on the approval status.' 
        });
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          expectedAttendees: '',
          budget: '',
          category: 'academic',
          requirements: '',
          contactPerson: user?.name || '',
          contactEmail: user?.email || '',
          contactPhone: ''
        });
        setAttachments([]);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Failed to submit proposal. Please try again.' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An error occurred while submitting the proposal.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('proposalDraft', JSON.stringify(formData));
    setMessage({ 
      type: 'success', 
      text: 'Draft saved successfully!' 
    });
  };

  // Load draft on component mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('proposalDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draftData }));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#ffeadb] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#8b597b] animate-pulse"></div>
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Event Proposal</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
            Create <span className="text-[#8b597b]">Proposal</span>
          </h1>
          <p className="text-[#493129]/60 font-bold text-lg">Submit your event proposal for administrative approval</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-8 border border-[#ffeadb] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-[#493129] mb-6 flex items-center gap-3">
                <FileText className="text-[#8b597b]" size={24} />
                Basic Information
              </h2>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
                placeholder="Enter event title"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium resize-none"
                placeholder="Describe your event in detail"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Expected Attendees *
              </label>
              <input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
                placeholder="Number of attendees"
              />
            </div>

            {/* Date & Time */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-black text-[#493129] mb-4 flex items-center gap-3">
                <Calendar className="text-[#8b597b]" size={20} />
                Date & Time
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Event Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
              />
            </div>

            {/* Venue & Budget */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-black text-[#493129] mb-4 flex items-center gap-3">
                <MapPin className="text-[#8b597b]" size={20} />
                Venue & Budget
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Preferred Venue *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
                placeholder="e.g., Main Auditorium, Conference Hall"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Estimated Budget
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min="0"
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
                placeholder="Budget in USD"
              />
            </div>

            {/* Requirements */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Special Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium resize-none"
                placeholder="Audio/visual equipment, catering, security, etc."
              />
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-black text-[#493129] mb-4 flex items-center gap-3">
                <Users className="text-[#8b597b]" size={20} />
                Contact Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
                placeholder="your.email@university.edu"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-black text-[#493129] mb-2 uppercase tracking-wide">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full p-4 bg-[#ffeadb] border border-[#ffdec7] rounded-2xl text-[#493129] placeholder-[#493129]/40 focus:outline-none focus:border-[#8b597b] transition-colors font-medium"
                placeholder="Your phone number"
              />
            </div>

            {/* File Attachments */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-black text-[#493129] mb-4 flex items-center gap-3">
                <Upload className="text-[#8b597b]" size={20} />
                Attachments (Optional)
              </h3>
              <div className="border-2 border-dashed border-[#ffdec7] rounded-2xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto text-[#493129]/40 mb-2" size={32} />
                  <p className="text-[#493129]/60 font-bold">Click to upload files</p>
                  <p className="text-[#493129]/40 text-sm">PDF, DOC, JPG, PNG (Max 10MB each)</p>
                </label>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#ffeadb] p-3 rounded-xl">
                      <span className="text-[#493129] font-medium text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#ffeadb]">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 bg-[#ffdec7] text-[#493129] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#efa3a0] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#8b597b] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#493129] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubProposal;