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
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
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

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);