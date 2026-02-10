const express = require('express');
const router = express.Router();
const authAPI = require('../services/authApi');

// Login Page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', { 
    title: 'Login - HackOverflow',
    error: null,
    showNavbar: false
  });
});

// Register Page
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/register', { 
    title: 'Register - HackOverflow',
    error: null,
    showNavbar: false
  });
});

// Handle Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authAPI.login({ email, password });
    
    // Store user data in session
    req.session.user = {
      id: result.user.id,
      name: result.user.name,
      role: result.user.role,
      token: result.token
    };
    
    res.redirect('/');
  } catch (error) {
    res.render('auth/login', {
      title: 'Login - HackOverflow',
      error: error.message,
      showNavbar: false
    });
  }
});

// Handle Register
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const result = await authAPI.register(userData);
    
    // Store user data in session
    req.session.user = {
      id: result.user.id,
      name: result.user.name,
      role: result.user.role,
      token: result.token
    };
    
    res.redirect('/');
  } catch (error) {
    res.render('auth/register', {
      title: 'Register - HackOverflow',
      error: error.message,
      showNavbar: false
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;