const express = require('express');
const router = express.Router();
const { addVenue, getVenues } = require('../controllers/resourceController');
const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');


router.get('/', getVenues);

// Add new venue (Admin Only)
router.post('/', isAuthenticated, authorize('admin'), addVenue);

module.exports = router;