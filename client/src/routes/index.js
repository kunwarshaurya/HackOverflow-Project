const express = require('express');
const router = express.Router();

// Home Page
router.get('/', (req, res) => {
  if (req.session.user) {
    // Redirect based on role
    switch (req.session.user.role) {
      case 'admin':
        return res.redirect('/admin/dashboard');
      case 'club_lead':
        return res.redirect('/club/dashboard');
      case 'student':
        return res.redirect('/student/dashboard');
      default:
        return res.redirect('/auth/login');
    }
  }
  
  res.render('index', { 
    title: 'HackOverflow - Event Management Platform',
    showNavbar: false
  });
});

// About Page
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About - HackOverflow',
    showNavbar: true
  });
});

module.exports = router;