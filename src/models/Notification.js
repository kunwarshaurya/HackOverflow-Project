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

  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);