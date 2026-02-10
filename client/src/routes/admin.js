const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999/api';

// Admin Auth Middleware
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/auth/login');
  }
  next();
};

// Admin Dashboard
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    
    // Fetch dashboard stats - simplified to work with existing backend
    const eventsResponse = await axios.get(`${API_BASE_URL}/events`, { headers });
    const clubsResponse = await axios.get(`${API_BASE_URL}/clubs`);
    
    // Create simple stats from available data
    const stats = {
      totalEvents: eventsResponse.data.data ? eventsResponse.data.data.length : 0,
      totalClubs: clubsResponse.data.data ? clubsResponse.data.data.length : 0,
      pendingApprovals: eventsResponse.data.data ? eventsResponse.data.data.filter(e => e.status === 'pending').length : 0,
      activeEvents: eventsResponse.data.data ? eventsResponse.data.data.filter(e => e.status === 'approved').length : 0
    };
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard - HackOverflow',
      stats: stats,
      events: eventsResponse.data.data || [],
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

// Event Approvals
router.get('/approvals', requireAdmin, async (req, res) => {
  try {
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    const response = await axios.get(`${API_BASE_URL}/events`, { headers });
    
    const events = response.data.data || [];
    const pendingEvents = events.filter(event => event.status === 'pending');
    
    res.render('admin/approvals', {
      title: 'Event Approvals - HackOverflow',
      events: pendingEvents,
      showNavbar: true
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.response?.data?.message || 'Failed to load approvals',
      statusCode: 500
    });
  }
});

// Handle Event Status Update
router.post('/events/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, comments } = req.body;
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    
    await axios.put(`${API_BASE_URL}/events/${req.params.id}/status`, 
      { status, adminComments: comments }, 
      { headers }
    );
    
    res.redirect('/admin/approvals');
  } catch (error) {
    res.redirect('/admin/approvals?error=' + encodeURIComponent(error.response?.data?.message || 'Failed to update event'));
  }
});

// Venue Management
router.get('/venues', requireAdmin, async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/venues`);
    
    res.render('admin/venues', {
      title: 'Venue Management - HackOverflow',
      venues: response.data.data || [],
      showNavbar: true,
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.response?.data?.message || 'Failed to load venues',
      statusCode: 500
    });
  }
});

// Add Venue
router.post('/venues', requireAdmin, async (req, res) => {
  try {
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    await axios.post(`${API_BASE_URL}/venues`, req.body, { headers });
    
    res.redirect('/admin/venues?success=Venue added successfully');
  } catch (error) {
    res.redirect('/admin/venues?error=' + encodeURIComponent(error.response?.data?.message || 'Failed to add venue'));
  }
});

// Club Management
router.get('/clubs', requireAdmin, async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clubs`);
    
    res.render('admin/clubs', {
      title: 'Club Management - HackOverflow',
      clubs: response.data.data || [],
      showNavbar: true,
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.response?.data?.message || 'Failed to load clubs',
      statusCode: 500
    });
  }
});

// Add Club
router.post('/clubs', requireAdmin, async (req, res) => {
  try {
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    
    // Prepare club data
    const clubData = {
      name: req.body.name,
      description: req.body.description
    };
    
    // Only add adminId if it's provided and looks like a valid ObjectId (24 characters)
    if (req.body.adminId && req.body.adminId.trim().length === 24) {
      clubData.adminId = req.body.adminId.trim();
    }
    
    await axios.post(`${API_BASE_URL}/clubs`, clubData, { headers });
    
    res.redirect('/admin/clubs?success=Club created successfully');
  } catch (error) {
    res.redirect('/admin/clubs?error=' + encodeURIComponent(error.response?.data?.message || 'Failed to create club'));
  }
});

// Get Club Members
router.get('/clubs/:id/members', requireAdmin, async (req, res) => {
  try {
    const headers = { 'Authorization': `Bearer ${req.session.user.token}` };
    
    // For now, return empty members since your backend doesn't have member management yet
    res.json({
      success: true,
      members: [],
      message: 'Member management not implemented in backend yet'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to get club members'
    });
  }
});

module.exports = router;