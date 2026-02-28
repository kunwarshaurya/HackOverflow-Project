const Event = require('../models/Event');
const Club = require('../models/Club');
const Venue = require('../models/Venue');

const express = require('express');
const router = express.Router();
const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.get(
  '/dashboard',
  isAuthenticated,
  authorize('admin'),
  async (req, res) => {
    try {

      const totalEvents = await Event.countDocuments();
      const pendingEvents = await Event.countDocuments({ status: 'pending' });
      const activeEvents = await Event.countDocuments({ status: 'approved' });
      const totalClubs = await Club.countDocuments();
      const totalVenues = await Venue.countDocuments();

      const recentEvents = await Event.find()
        .populate('club', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

      res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        stats: {
          totalEvents,
          pendingEvents,
          activeEvents,
          totalClubs,
          totalVenues
        },
        events: recentEvents,
        error: null,
        success: null
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

router.get(
  '/approvals',
  isAuthenticated,
  authorize('admin'),
  async (req, res) => {
    try {

      const pendingEvents = await Event.find({ status: 'pending' })
        .populate('club', 'name')
        .populate('organizer', 'name email')
        .populate('venue', 'name')
        .populate('collaborators.club', 'name')
      res.render('admin/approvals', {
        title: 'Event Approvals',
        events: pendingEvents,
        error: null,
        success: null
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

router.get('/clubs',
  isAuthenticated,
  authorize('admin'),
  adminController.getClubs
);

router.get('/venues',
  isAuthenticated,
  authorize('admin'),
  adminController.getVenues
);

router.post(
  '/venues',
  isAuthenticated,
  authorize('admin'),
  adminController.createVenue
);
router.post(
  '/venues/:id/delete',
  isAuthenticated,
  authorize('admin'),
  adminController.deleteVenue
);


module.exports = router;