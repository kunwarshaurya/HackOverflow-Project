const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  venue: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  budget: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },

  adminComments: { type: String },
  receiptUrl: { type: String }, // uploaded proof path

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
