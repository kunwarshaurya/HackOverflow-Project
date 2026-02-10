const express = require('express');
const router = express.Router();
const eventAPI = require('../services/eventApi');

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Event Details Page
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const userId = req.session.user.id;
    
    // Get all events and find the specific one
    const eventsResponse = await eventAPI.getEvents(token);
    const events = eventsResponse.data || [];
    const event = events.find(e => e._id === req.params.id);
    
    if (!event) {
      return res.redirect('/student/discover?error=Event not found');
    }
    
    const isRegistered = event.attendees && event.attendees.includes(userId);
    const canRegister = req.session.user.role === 'student' && event.status === 'approved';
    const canManage = req.session.user.role === 'club_lead' && event.organizer === userId;
    const canApprove = req.session.user.role === 'admin';
    
    res.render('events/details', {
      title: `${event.name} - HackOverflow`,
      event: event,
      isRegistered: isRegistered,
      canRegister: canRegister,
      canManage: canManage,
      canApprove: canApprove,
      showNavbar: true,
      user: req.session.user,
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.message || 'Failed to load event details',
      statusCode: 500
    });
  }
});

module.exports = router;