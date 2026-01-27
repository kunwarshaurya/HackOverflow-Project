const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEventStatus,
  settleEvent
} = require('../controllers/eventController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', protect, createEvent);
router.get('/', protect, getEvents);
router.put('/:id/status', protect, admin, updateEventStatus);
router.post('/:id/settle', protect, upload.single('receipt'), settleEvent);

module.exports = router;
