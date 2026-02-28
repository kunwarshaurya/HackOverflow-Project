const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Venue name is required'], 
    unique: true 
  }, 
  
  location: { type: String, required: true }, 
  
  capacity: { type: Number, required: true }, 
  
  
  resources: [String], 
  
  isAvailable: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', VenueSchema);