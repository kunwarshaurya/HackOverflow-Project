const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');
const studentController = require('../controllers/studentController');
const { validateObjectId } = require('../middlewares/validationMiddleware');

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many registration attempts.',
  handler: (_req, res) => {
    res.status(429).render('error', {
      title: 'Too Many Requests',
      error: 'Too many registration attempts. Please try again later.',
      statusCode: 429
    });
  }
});

router.get('/dashboard', isAuthenticated, authorize('student'), studentController.getDashboard);
router.get('/discover', isAuthenticated, authorize('student'), studentController.getDiscover);
router.get('/tickets', isAuthenticated, authorize('student'), studentController.getTickets);
router.post(
  '/events/:eventId/register',
  isAuthenticated,
  authorize('student'),
  registrationLimiter,
  validateObjectId('eventId'),
  studentController.registerForEvent
);
router.get(
  '/events/:eventId',
  isAuthenticated,
  authorize('student'),
  validateObjectId('eventId'),
  studentController.getEventDetails
);

module.exports = router;