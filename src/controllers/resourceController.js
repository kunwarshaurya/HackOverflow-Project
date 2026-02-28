const Venue = require('../models/Venue');

exports.addVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.redirect('/admin/dashboard'); // Redirect on success
  } catch (error) {
    console.error('Error adding venue:', error.message);
    res.redirect('/admin/dashboard'); // Redirect on failure for now
  }
};

exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isAvailable: true });
    // In a pure MVC app, a GET route fetching data renders a view
    res.render('admin/venues', { title: 'Venues', venues, user: req.user });
  } catch (error) {
    console.error('Error fetching venues:', error.message);
    res.redirect('/admin/dashboard');
  }
};