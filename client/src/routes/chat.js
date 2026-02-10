const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999/api';

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Event Chat Page
router.get('/event/:eventId', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Get event details
    const eventsResponse = await axios.get(`${API_BASE_URL}/events`, { headers });
    const events = eventsResponse.data.data || [];
    const event = events.find(e => e._id === req.params.eventId);
    
    if (!event) {
      return res.redirect('/student/discover?error=Event not found');
    }
    
    // Get chat messages - handle if chat API doesn't exist
    let messages = [];
    try {
      const messagesResponse = await axios.get(`${API_BASE_URL}/chat/event/${req.params.eventId}`, { headers });
      messages = messagesResponse.data.data || [];
    } catch (error) {
      console.log('Chat API not available, using empty messages');
    }
    
    res.render('chat/event-chat', {
      title: `${event.name} Chat - HackOverflow`,
      event: event,
      messages: messages,
      user: req.session.user,
      showNavbar: true
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.response?.data?.message || 'Failed to load chat',
      statusCode: 500
    });
  }
});

// Club Chat Page
router.get('/club/:clubId', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Get club details
    const clubsResponse = await axios.get(`${API_BASE_URL}/clubs`, { headers });
    const clubs = clubsResponse.data.data || [];
    const club = clubs.find(c => c._id === req.params.clubId);
    
    if (!club) {
      return res.redirect('/student/discover?error=Club not found');
    }
    
    // Get chat messages - handle if chat API doesn't exist
    let messages = [];
    try {
      const messagesResponse = await axios.get(`${API_BASE_URL}/chat/club/${req.params.clubId}`, { headers });
      messages = messagesResponse.data.data || [];
    } catch (error) {
      console.log('Chat API not available, using empty messages');
    }
    
    res.render('chat/club-chat', {
      title: `${club.name} Chat - HackOverflow`,
      club: club,
      messages: messages,
      user: req.session.user,
      showNavbar: true
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.response?.data?.message || 'Failed to load chat',
      statusCode: 500
    });
  }
});

// Send Message API
router.post('/send', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    
    // Validate message content
    const { content, clubId, eventId, type } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message content cannot be empty' 
      });
    }
    
    if (content.trim().length > 500) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message content cannot exceed 500 characters' 
      });
    }
    
    // Prepare message data for server API
    const messageData = {
      content: content.trim()
    };
    
    // Add context based on type
    if (type === 'club' && clubId) {
      messageData.clubId = clubId;
    } else if (type === 'event' && eventId) {
      messageData.eventId = eventId;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message type or missing context ID' 
      });
    }
    
    // Send to server API endpoint
    const response = await axios.post(`${API_BASE_URL}/chat`, messageData, { headers });
    
    res.json({ 
      success: true, 
      data: response.data.data || response.data,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Chat send error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Failed to send message' 
    });
  }
});

// Get messages for club chat
router.get('/club/:clubId/messages', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    const { since } = req.query;
    
    let url = `${API_BASE_URL}/chat/club/${req.params.clubId}`;
    if (since) {
      url += `?since=${encodeURIComponent(since)}`;
    }
    
    const response = await axios.get(url, { headers });
    let messages = response.data.data || response.data || [];
    
    // Filter messages by 'since' parameter if provided (client-side filtering as fallback)
    if (since && messages.length > 0) {
      const sinceDate = new Date(since);
      messages = messages.filter(msg => new Date(msg.createdAt) > sinceDate);
    }
    
    res.json({ 
      success: true, 
      data: messages
    });
  } catch (error) {
    console.error('Get club messages error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      data: [],
      message: error.response?.data?.message || 'Failed to load messages' 
    });
  }
});

// Get messages for event chat
router.get('/event/:eventId/messages', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    const { since } = req.query;
    
    let url = `${API_BASE_URL}/chat/event/${req.params.eventId}`;
    if (since) {
      url += `?since=${encodeURIComponent(since)}`;
    }
    
    const response = await axios.get(url, { headers });
    let messages = response.data.data || response.data || [];
    
    // Filter messages by 'since' parameter if provided (client-side filtering as fallback)
    if (since && messages.length > 0) {
      const sinceDate = new Date(since);
      messages = messages.filter(msg => new Date(msg.createdAt) > sinceDate);
    }
    
    res.json({ 
      success: true, 
      data: messages
    });
  } catch (error) {
    console.error('Get event messages error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      data: [],
      message: error.response?.data?.message || 'Failed to load messages' 
    });
  }
});

module.exports = router;