const express = require('express');
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEventStatus,
  registerForEvent,
  settleEvent
} = require('../controllers/eventController');

const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// ================= CREATE EVENT =================
// Only club_lead can create
router.post(
  '/',
  isAuthenticated,
  authorize('club_lead'),
  createEvent
);

// ================= GET EVENTS =================
// Any logged-in user
router.get(
  '/',
  isAuthenticated,
  getEvents
);

// ================= UPDATE EVENT STATUS =================
// Only admin
router.put(
  '/:id/status',
  isAuthenticated,
  authorize('admin'),
  updateEventStatus
);

// ================= SETTLE EVENT =================
// Only club_lead
router.post(
  '/:id/settle',
  isAuthenticated,
  authorize('club_lead'),
  upload.single('receipt'),
  settleEvent
);

// ================= REGISTER FOR EVENT =================
// Only student
router.post(
  '/:id/register',
  isAuthenticated,
  authorize('student'),
  registerForEvent
);

module.exports = router;