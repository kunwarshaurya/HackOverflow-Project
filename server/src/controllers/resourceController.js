const Venue = require('../models/Venue');

exports.addVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({ success: true, data: venue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isAvailable: true });
    res.status(200).json({ success: true, count: venues.length, data: venues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};