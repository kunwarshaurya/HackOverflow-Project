const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEventStatus,
  registerForEvent,
  settleEvent
} = require('../controllers/eventController');


const { protect, admin, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

//enhanced sec only club lead have the access 
router.post('/', protect, authorize('club_lead'), createEvent);

router.get('/', protect, getEvents);
router.put('/:id/status', protect, admin, updateEventStatus);
router.post('/:id/settle', protect, upload.single('receipt'), settleEvent);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;