const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, logout } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middlewares/validators');

// ================= RATE LIMITING =================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per window
  message: 'Too many attempts. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).render('error', {
      title: 'Too Many Requests',
      error: 'Too many attempts. Please try again in 15 minutes.',
      statusCode: 429
    });
  }
});

// Render pages
router.get('/register', (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    error: null
  });
});

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: null
  });
});

// Handle form submissions with validation + rate limiting
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);

// Logout
router.post('/logout', logout);

module.exports = router;