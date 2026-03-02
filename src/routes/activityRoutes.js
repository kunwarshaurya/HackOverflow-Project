// src/routes/activityRoutes.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const activityController = require('../controllers/activityController');

router.get('/', isAuthenticated, activityController.getActivityFeed);

module.exports = router;
