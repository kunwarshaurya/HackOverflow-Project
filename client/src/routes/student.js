const express = require('express');
const router = express.Router();
const axios = require('axios');
const eventAPI = require('../services/eventApi');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999/api';

// Student Auth Middleware
const requireStudent = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'student') {
    return res.redirect('/auth/login');
  }
  next();
};

// Student Dashboard
router.get('/dashboard', requireStudent, async (req, res) => {
  try {
    const token = req.session.user.token;
    
    // Fetch upcoming events (students only see approved events)
    const eventsResponse = await eventAPI.getEvents(token);
    const clubsResponse = await axios.get(`${API_BASE_URL}/clubs`);
    
    const events = eventsResponse.data || [];
    const clubs = clubsResponse.data.data || [];
    
    res.render('student/dashboard', {
      title: 'Student Dashboard - HackOverflow',
      events: events.slice(0, 5), // Show only first 5 events
      clubs: clubs,
      showNavbar: true
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.response?.data?.message || 'Failed to load dashboard',
      statusCode: 500
    });
  }
});

// Discovery Feed (All Events)
router.get('/discover', requireStudent, async (req, res) => {
  try {
    const token = req.session.user.token;
    const eventsResponse = await eventAPI.getEvents(token);
    
    res.render('student/discover', {
      title: 'Discover Events - HackOverflow',
      events: eventsResponse.data || [],
      showNavbar: true
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.message || 'Failed to load events',
      statusCode: 500
    });
  }
});

// My Tickets (Registered Events)
router.get('/tickets', requireStudent, async (req, res) => {
  try {
    const token = req.session.user.token;
    const userId = req.session.user.id;
    
    // Get all events and filter by attendees
    const eventsResponse = await eventAPI.getEvents(token);
    const events = eventsResponse.data || [];
    const registeredEvents = events.filter(event => 
      event.attendees && event.attendees.includes(userId)
    );
    
    res.render('student/tickets', {
      title: 'My Tickets - HackOverflow',
      events: registeredEvents,
      showNavbar: true
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.message || 'Failed to load tickets',
      statusCode: 500
    });
  }
});

// Event Details
router.get('/events/:id', requireStudent, async (req, res) => {
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
    const canRegister = req.session.user.role === 'student' && event.status === 'approved' && !isRegistered;
    const canManage = false; // Students can't manage events
    const canApprove = false; // Students can't approve events
    
    res.render('student/event-details', {
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

// Register for Event
router.post('/events/:id/register', requireStudent, async (req, res) => {
  try {
    const token = req.session.user.token;
    await eventAPI.registerForEvent(token, req.params.id);
    
    res.redirect(`/student/events/${req.params.id}?success=Successfully registered for event`);
  } catch (error) {
    res.redirect(`/student/events/${req.params.id}?error=` + encodeURIComponent(error.message));
  }
});

// Debug route for testing
router.get('/debug-event/:id', requireStudent, async (req, res) => {
  try {
    const token = req.session.user.token;
    const userId = req.session.user.id;
    
    // Get all events and find the specific one
    const eventsResponse = await eventAPI.getEvents(token);
    const events = eventsResponse.data || [];
    const event = events.find(e => e._id === req.params.id);
    
    if (!event) {
      return res.send(`
        <h1>Event Not Found</h1>
        <p>Event ID: ${req.params.id}</p>
        <p>Available Events: ${events.length}</p>
        <pre>${JSON.stringify(events.map(e => ({id: e._id, name: e.name})), null, 2)}</pre>
        <a href="/student/discover">Back to Discover</a>
      `);
    }
    
    const isRegistered = event.attendees && event.attendees.includes(userId);
    const canRegister = req.session.user.role === 'student' && event.status === 'approved' && !isRegistered;
    
    res.send(`
      <h1>Event Debug Info</h1>
      <h2>Event: ${event.name}</h2>
      <p><strong>Event ID:</strong> ${event._id}</p>
      <p><strong>Status:</strong> ${event.status}</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>User Role:</strong> ${req.session.user.role}</p>
      <p><strong>Is Registered:</strong> ${isRegistered}</p>
      <p><strong>Can Register:</strong> ${canRegister}</p>
      <p><strong>Attendees:</strong> ${JSON.stringify(event.attendees || [])}</p>
      <a href="/student/events/${event._id}">View Event Details</a> | 
      <a href="/student/discover">Back to Discover</a>
    `);
  } catch (error) {
    res.send(`
      <h1>Debug Error</h1>
      <p>Error: ${error.message}</p>
      <p>Stack: ${error.stack}</p>
      <a href="/student/discover">Back to Discover</a>
    `);
  }
});

module.exports = router;