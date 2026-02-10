const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'club_lead', 'admin'],
    default: 'student'
  },

  department: { type: String }, 
  year: { type: String },       
  
 
  joinedClubs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club' 
  }],

 
  managedClub: { type: String }, 

  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function () {
  // hash password only when changed
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
