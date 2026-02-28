const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 🔹 Render pages
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

// 🔹 Handle form submission
router.post('/register', register);
router.post('/login', login);

module.exports = router;