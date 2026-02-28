const Event = require('../models/Event');
const Club = require('../models/Club');
const Venue = require('../models/Venue');

exports.dashboard = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'approved' });
    const pendingApprovals = await Event.countDocuments({ status: 'pending' });
    const totalClubs = await Club.countDocuments();
    const totalVenues = await Venue.countDocuments();

    const recentEvents = await Event.find()
      .populate('club', 'name')
      .populate('venue', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: {
        totalEvents,
        activeEvents,
        pendingApprovals,
        totalClubs,
        totalVenues
      },
      events: recentEvents,   // 👈 ADD THIS
      error: null,
      success: null
    });

  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};

exports.getApprovals = async (req, res) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('club', 'name')
      .populate('venue', 'name')
      .sort({ createdAt: -1 });

    res.render('admin/approvals', {
      title: 'Event Approvals',
      events,
      error: null,
      success: null
    });

  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
};

exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    res.render('admin/clubs', {
      title: 'Manage Clubs',
      clubs,
      error: null,
      success: null
    });

  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
};

exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });

    res.render('admin/venues', {
      title: 'Manage Venues',
      venues,
      error: null,
      success: null
    });

  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
};

exports.createVenue = async (req, res) => {
  try {
    const { name, location, capacity, resources } = req.body;

    await Venue.create({
      name,
      location,
      capacity,
      resources: resources ? resources.split(',').map(r => r.trim()) : []
    });

    res.redirect('/admin/venues');

  } catch (error) {
    console.error(error.message);
    res.redirect('/admin/venues');
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const venueId = req.params.id;

    const eventsUsingVenue = await Event.countDocuments({ venue: venueId });

    if (eventsUsingVenue > 0) {
      return res.render('error', {
        title: 'Cannot Delete Venue',
        error: 'This venue is associated with existing events.',
        statusCode: 400
      });
    }

    await Venue.findByIdAndDelete(venueId);

    res.redirect('/admin/venues');

  } catch (error) {
    console.error(error);
    res.redirect('/admin/venues');
  }
};