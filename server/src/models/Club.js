const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Club name is required'], 
    unique: true 
  }, 
  description: { type: String },
  
  // Links to a Club Lead User
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, 
  

  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Club', ClubSchema);