const express = require('express');
const router = express.Router();
const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const Event = require('../models/Event');
const { validateObjectId, validateEventStatus } = require('../middlewares/validationMiddleware');

router.get(
  '/dashboard',
  isAuthenticated,
  authorize('admin'),
  adminController.dashboard
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

const { updateEventStatus } = require('../controllers/eventController');

// Event approval/rejection (form in approvals.ejs posts here)
router.post(
  '/events/:id/status',
  isAuthenticated,
  authorize('admin'),
  validateObjectId('id'),
  validateEventStatus,
  updateEventStatus
);
const { getAnalyticsPage, exportCSV } = require('../controllers/analyticsController');

// Admin analytics page
router.get(
  '/analytics',
  isAuthenticated,
  authorize('admin'),
  getAnalyticsPage
);

// CSV export
router.get(
  '/analytics/export',
  isAuthenticated,
  authorize('admin'),
  exportCSV
);

module.exports = router;