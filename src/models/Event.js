const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: false
  },

  collaborators: [{
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club'
    },
    role: {
      type: String,
      default: 'Co-Host'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'accepted'
    }
  }],

  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },

  date: { type: Date, required: true },
  startTime: { type: Number, required: true, min: 0, max: 1439 },
  endTime: { type: Number, required: true, min: 0, max: 1439 },
  budget: { type: Number, required: true },

  capacity: {
    type: Number,
    required: true,
    min: 1,
    default: 3
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },

  adminComments: { type: String },
  receiptUrl: { type: String },

  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  reminderSent: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

// Virtual to format startTime as HH:MM for display
EventSchema.virtual('startTimeFormatted').get(function () {
  if (this.startTime == null) return '';
  const hours = Math.floor(this.startTime / 60);
  const mins = this.startTime % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
});

// Virtual to format endTime as HH:MM for display
EventSchema.virtual('endTimeFormatted').get(function () {
  if (this.endTime == null) return '';
  const hours = Math.floor(this.endTime / 60);
  const mins = this.endTime % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
});

EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);