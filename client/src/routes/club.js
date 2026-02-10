const express = require('express');
const router = express.Router();
const axios = require('axios');
const eventAPI = require('../services/eventApi');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999/api';

// Club Lead Auth Middleware
const requireClubLead = (req, res, next) => {
  console.log('=== AUTH CHECK ===');
  console.log('Session user:', req.session.user);
  console.log('User role:', req.session.user?.role);
  
  if (!req.session.user) {
    console.log('No user in session, redirecting to login');
    return res.redirect('/auth/login');
  }
  
  if (req.session.user.role !== 'club_lead') {
    console.log('User role is not club_lead, role is:', req.session.user.role);
    return res.redirect('/auth/login');
  }
  
  console.log('Auth check passed');
  next();
};

// Club Dashboard
router.get('/dashboard', requireClubLead, async (req, res) => {
  console.log('=== CLUB DASHBOARD ===');
  console.log('User session:', req.session.user);
  
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Initialize with empty arrays to prevent crashes
    let events = [];
    let clubs = [];
    let stats = {
      totalEvents: 0,
      activeEvents: 0,
      pendingEvents: 0,
      totalClubs: 0
    };
    
    try {
      // Fetch events
      const eventsResponse = await eventAPI.getEvents(token);
      events = eventsResponse.data || [];
      console.log('Events loaded:', events.length);
      
      // Update stats
      stats.totalEvents = events.length;
      stats.activeEvents = events.filter(e => e.status === 'approved').length;
      stats.pendingEvents = events.filter(e => e.status === 'pending').length;
    } catch (error) {
      console.log('Events API error:', error.message);
      events = [];
    }
    
    try {
      // Fetch clubs
      const clubsResponse = await axios.get(`${API_BASE_URL}/clubs`, { headers });
      clubs = clubsResponse.data.data || [];
      console.log('Clubs loaded:', clubs.length);
      stats.totalClubs = clubs.length;
    } catch (error) {
      console.log('Clubs API error:', error.message);
      clubs = [];
    }
    
    console.log('Rendering dashboard with:', { events: events.length, clubs: clubs.length, stats });
    
    // Use proper EJS template with all required variables
    res.render('club/dashboard', {
      title: 'Club Dashboard - HackOverflow',
      events: events,
      clubs: clubs,
      stats: stats,
      showNavbar: true,
      user: req.session.user,
      success: req.query.success || null,
      error: req.query.error || null
    });
    
  } catch (error) {
    console.error('Dashboard render error:', error);
    res.render('error', {
      title: 'Error',
      error: 'Failed to load dashboard: ' + error.message,
      statusCode: 500
    });
  }
});

// Create Event Page (Simple Version)
router.get('/create-event-simple', requireClubLead, async (req, res) => {
  try {
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    
    console.log('Loading simple create event page...');
    
    // Initialize with empty arrays to prevent crashes
    let venues = [];
    let clubs = [];
    
    try {
      // Fetch venues
      const venuesResponse = await axios.get(`${API_BASE_URL}/venues`);
      venues = venuesResponse.data.data || [];
      console.log('Venues loaded:', venues.length);
    } catch (error) {
      console.log('Venues API error:', error.message);
    }
    
    try {
      // Fetch clubs
      const clubsResponse = await axios.get(`${API_BASE_URL}/clubs`, { headers });
      clubs = clubsResponse.data.data || [];
      console.log('Clubs loaded:', clubs.length);
    } catch (error) {
      console.log('Clubs API error:', error.message);
    }
    
    res.render('club/create-event-simple', {
      title: 'Create Event - HackOverflow',
      venues: venues,
      clubs: clubs,
      user: req.session.user,
      error: req.query.error || null
    });
  } catch (error) {
    console.error('Create event page error:', error);
    res.send(`
      <h1>Error Loading Create Event Page</h1>
      <p>Error: ${error.message}</p>
      <a href="/club/dashboard">Back to Dashboard</a>
    `);
  }
});

// Create Event Page
router.get('/create-event', requireClubLead, async (req, res) => {
  try {
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    
    console.log('Loading create event page...');
    
    // Initialize with empty arrays to prevent crashes
    let venues = [];
    let clubs = [];
    
    try {
      // Fetch venues
      const venuesResponse = await axios.get(`${API_BASE_URL}/venues`);
      venues = venuesResponse.data.data || [];
      console.log('Venues loaded:', venues.length);
    } catch (error) {
      console.log('Venues API error:', error.message);
    }
    
    try {
      // Fetch clubs
      const clubsResponse = await axios.get(`${API_BASE_URL}/clubs`, { headers });
      clubs = clubsResponse.data.data || [];
      console.log('Clubs loaded:', clubs.length);
    } catch (error) {
      console.log('Clubs API error:', error.message);
    }
    
    res.render('club/create-event', {
      title: 'Create Event - HackOverflow',
      venues: venues,
      clubs: clubs,
      showNavbar: true,
      error: req.query.error || null
    });
  } catch (error) {
    console.error('Create event page error:', error);
    res.render('error', {
      title: 'Error',
      error: 'Failed to load create event page: ' + error.message,
      statusCode: 500
    });
  }
});

// Handle Create Event
router.post('/create-event', requireClubLead, async (req, res) => {
  try {
    console.log('=== CREATE EVENT SUBMISSION ===');
    console.log('Form data received:', req.body);
    console.log('User:', req.session.user);
    console.log('API Base URL:', API_BASE_URL);
    
    const token = req.session.user.token;
    
    // Validate required fields
    if (!req.body.name || !req.body.venueId || !req.body.clubId) {
      console.log('Missing required fields:', {
        name: !!req.body.name,
        venueId: !!req.body.venueId,
        clubId: !!req.body.clubId
      });
      return res.redirect('/club/create-event?error=' + encodeURIComponent('Missing required fields'));
    }
    
    const eventData = {
      name: req.body.name,
      description: req.body.description,
      venueId: req.body.venueId,
      clubId: req.body.clubId,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      budget: parseFloat(req.body.budget) || 0,
      collaboratorIds: req.body.collaboratorIds ? (Array.isArray(req.body.collaboratorIds) ? req.body.collaboratorIds : [req.body.collaboratorIds]) : []
    };
    
    console.log('Prepared event data:', eventData);
    console.log('Token present:', !!token);
    
    // Test API connection first
    try {
      console.log('Testing API connection...');
      const testResponse = await axios.get(`${API_BASE_URL}/clubs`);
      console.log('API connection test successful:', testResponse.status);
    } catch (testError) {
      console.error('API connection test failed:', testError.message);
      return res.redirect('/club/create-event?error=' + encodeURIComponent('Backend API not available'));
    }
    
    // Create event
    console.log('Calling eventAPI.createEvent...');
    const response = await eventAPI.createEvent(token, eventData);
    console.log('Event created successfully:', response);
    
    res.redirect('/club/dashboard?success=Event created successfully and submitted for approval');
    
  } catch (error) {
    console.error('=== CREATE EVENT ERROR ===');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    let errorMessage = 'Failed to create event';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.redirect('/club/create-event?error=' + encodeURIComponent(errorMessage));
  }
});

// My Events
router.get('/events', requireClubLead, async (req, res) => {
  try {
    const token = req.session.user.token;
    const history = req.query.history === 'true';
    
    console.log('Loading events page, history:', history);
    
    let events = [];
    try {
      const eventsResponse = await eventAPI.getEvents(token, history);
      events = eventsResponse.data || [];
      console.log('Events loaded:', events.length);
    } catch (error) {
      console.log('Events API error:', error.message);
    }
    
    res.render('club/events', {
      title: history ? 'Event History - HackOverflow' : 'My Events - HackOverflow',
      events: events,
      isHistory: history,
      showNavbar: true,
      user: req.session.user
    });
  } catch (error) {
    console.error('Events page error:', error);
    res.render('error', {
      title: 'Error',
      error: 'Failed to load events: ' + error.message,
      statusCode: 500
    });
  }
});

// Event Settlement
router.get('/events/:id/settle', requireClubLead, async (req, res) => {
  try {
    const token = req.session.user.token;
    
    // Get event details
    const eventsResponse = await eventAPI.getEvents(token);
    const events = eventsResponse.data || [];
    const event = events.find(e => e._id === req.params.id);
    
    if (!event) {
      return res.redirect('/club/events?error=Event not found');
    }
    
    res.render('club/settle-event', {
      title: 'Settle Event - HackOverflow',
      event: event,
      showNavbar: true,
      error: req.query.error || null
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.message || 'Failed to load event settlement page',
      statusCode: 500
    });
  }
});

// Handle Event Settlement
router.post('/events/:id/settle', requireClubLead, async (req, res) => {
  try {
    const token = req.session.user.token;
    const formData = new FormData();
    
    if (req.files && req.files.receipt) {
      formData.append('receipt', req.files.receipt.data, req.files.receipt.name);
    }
    
    await eventAPI.settleEvent(token, req.params.id, formData);
    res.redirect('/club/events?success=Event settled successfully');
  } catch (error) {
    res.redirect(`/club/events/${req.params.id}/settle?error=` + encodeURIComponent(error.message));
  }
});

module.exports = router;