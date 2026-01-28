const express = require('express');
const router = express.Router();
const { addVenue, getVenues } = require('../controllers/resourceController');
const { protect, admin } = require('../middlewares/authMiddleware');


router.get('/', getVenues);

// Add new venue (Admin Only)
router.post('/', protect, admin, addVenue);

module.exports = router;