const express = require('express');
const router = express.Router();

const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');
const clubController = require('../controllers/clubController');


// =======================
// Club Dashboard
// =======================
router.get(
  '/dashboard',
  isAuthenticated,
  authorize('club_lead'),
  clubController.dashboard
);


// =======================
// My Events
// =======================
router.get(
  '/events',
  isAuthenticated,
  authorize('club_lead'),
  async (req, res) => {
    const Event = require('../models/Event');

    const events = await Event.find({ organizer: req.user.id })
      .populate('venue', 'name')
      .sort({ date: 1 });

    res.render('club/events', {
      title: 'My Events',
      events,
      isHistory: false,
      user: req.user
    });
  }
);


// =======================
// Create Event Page
// =======================
router.get(
  '/create-event',
  isAuthenticated,
  authorize('club_lead'),
  async (req, res) => {
    const Venue = require('../models/Venue');
    const Club = require('../models/Club');

    const venues = await Venue.find({ isAvailable: true });
    const clubs = await Club.find();

    res.render('club/create-event', {
      title: 'Create Event',
      venues,
      clubs,
      user: req.user
    });
  }
);

module.exports = router;