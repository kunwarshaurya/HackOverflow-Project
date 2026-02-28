const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getClubStats 
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middlewares/authMiddleware');


router.get('/dashboard', protect, admin, getDashboardStats);

router.get('/club/:clubId', protect, getClubStats);

module.exports = router;