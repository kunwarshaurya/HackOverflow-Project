const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // Who is this notification for?
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  message: { type: String, required: true },

  // Type helps the frontend choose a color (Green for success, Red for alert)
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },

  // Link it to an event (Optional, so they can click "View Event")
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },

  // Link to an equipment booking (Optional)
  relatedBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentBooking'
  },

  // Standardized category for activity classification
  category: {
    type: String,
    enum: [
      'EVENT_CREATED', 'EVENT_APPROVED', 'EVENT_REJECTED', 'EVENT_COMPLETED',
      'BOOKING_CREATED', 'BOOKING_APPROVED', 'BOOKING_REJECTED',
      'REMINDER_SENT', 'GENERAL'
    ],
    default: 'GENERAL'
  },

  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ category: 1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);