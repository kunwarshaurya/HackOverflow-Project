const Club = require('../models/Club');

exports.createClub = async (req, res) => {
  try {
    const { name, description, adminId } = req.body;

    const club = await Club.create({
      name,
      description,
      admin: adminId || req.user.id 
    });

    res.status(201).json({ success: true, data: club });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('admin', 'name email');
    res.status(200).json({ success: true, count: clubs.length, data: clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};