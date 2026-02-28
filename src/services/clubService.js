const Club = require('../models/Club');

exports.getAllActiveClubs = async () => {
  return await Club.find().sort({ createdAt: -1 });
};