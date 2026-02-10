const express = require('express');
const router = express.Router();
const { createClub, getClubs } = require('../controllers/clubController');
const { protect, admin } = require('../middlewares/authMiddleware');


router.get('/', getClubs);


router.post('/', protect, admin, createClub);

module.exports = router;