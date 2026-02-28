const express = require('express');
const router = express.Router();

const {
  getMyNotifications,
  markAsRead
} = require('../controllers/notificationController');

const { isAuthenticated } = require('../middlewares/authMiddleware');

// Get logged-in user's notifications
router.get(
  '/',
  isAuthenticated,
  getMyNotifications
);

// Mark notification as read
router.put(
  '/:id/read',
  isAuthenticated,
  markAsRead
);

module.exports = router;