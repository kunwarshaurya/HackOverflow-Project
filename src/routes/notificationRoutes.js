const express = require('express');
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

const { isAuthenticated } = require('../middlewares/authMiddleware');

// Get logged-in user's notifications
router.get(
  '/',
  isAuthenticated,
  getMyNotifications
);

// Mark single notification as read
router.post(
  '/:id/read',
  isAuthenticated,
  markAsRead
);

// Mark all notifications as read
router.post(
  '/mark-all-read',
  isAuthenticated,
  markAllAsRead
);

module.exports = router;