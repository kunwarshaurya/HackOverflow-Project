const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middlewares/authMiddleware');
const studentController = require('../controllers/studentController');

router.get('/dashboard', isAuthenticated, studentController.getDashboard);
router.get('/discover', isAuthenticated, studentController.getDiscover);
router.get('/tickets', isAuthenticated, studentController.getTickets);
router.post(
  '/events/:eventId/register',
  isAuthenticated,
  studentController.registerForEvent
);
router.get(
  '/events/:eventId',
  isAuthenticated,
  studentController.getEventDetails
);

module.exports = router;