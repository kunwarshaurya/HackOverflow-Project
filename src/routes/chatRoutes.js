const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getEventMessages,
  getClubMessages
} = require('../controllers/chatController');

const { isAuthenticated } = require('../middlewares/authMiddleware');

// Send message (only logged-in users)
router.post(
  '/',
  isAuthenticated,
  sendMessage
);

// Get event messages
router.get(
  '/event/:eventId',
  isAuthenticated,
  getEventMessages
);

// Get club messages
router.get(
  '/club/:clubId',
  isAuthenticated,
  getClubMessages
);

module.exports = router;