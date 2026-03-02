const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getClubStats,
  getAnalyticsPage,
  exportCSV
} = require('../controllers/analyticsController');
const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');

// Existing routes
router.get('/dashboard', isAuthenticated, authorize('admin'), getDashboardStats);
router.get('/club/:clubId', isAuthenticated, getClubStats);

module.exports = router;