const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  content: { type: String, required: true },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  },
  
  club: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club' 
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);