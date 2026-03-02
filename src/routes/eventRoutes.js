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
const { validateEventCreation, validateEventStatus, validateObjectId } = require('../middlewares/validationMiddleware');
const { verifyEventOwnership } = require('../middlewares/ownershipMiddleware');

// ================= CREATE EVENT =================
// Only club_lead can create
router.post(
  '/',
  isAuthenticated,
  authorize('club_lead'),
  validateEventCreation,
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
router.post(
  '/:id/status',
  isAuthenticated,
  authorize('admin'),
  validateObjectId('id'),
  validateEventStatus,
  updateEventStatus
);

// ================= SETTLE EVENT =================
// Only club_lead — must own the event
router.post(
  '/:id/settle',
  isAuthenticated,
  authorize('club_lead'),
  validateObjectId('id'),
  verifyEventOwnership,
  upload.single('receipt'),
  settleEvent
);

// ================= REGISTER FOR EVENT =================
// Only student
router.post(
  '/:id/register',
  isAuthenticated,
  authorize('student'),
  validateObjectId('id'),
  registerForEvent
);

module.exports = router;