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

// Notifications Page
router.get('/', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Handle if notifications API doesn't exist
    let notifications = [];
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, { headers });
      notifications = response.data.data || [];
    } catch (error) {
      console.log('Notifications API not available, using empty notifications');
    }
    
    res.render('notifications/index', {
      title: 'Notifications - HackOverflow',
      notifications: notifications,
      showNavbar: true
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      error: error.response?.data?.message || 'Failed to load notifications',
      statusCode: 500
    });
  }
});

// API endpoint for AJAX requests
router.get('/api', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Handle if notifications API doesn't exist
    let notifications = [];
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, { headers });
      notifications = response.data.data || [];
    } catch (error) {
      console.log('Notifications API not available, using empty notifications');
    }
    
    res.json({
      success: true,
      notifications: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to load notifications'
    });
  }
});

// Mark notification as read
router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    await axios.put(`${API_BASE_URL}/notifications/${req.params.id}/read`, {}, { headers });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to mark notification as read'
    });
  }
});

// Delete single notification
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    await axios.delete(`${API_BASE_URL}/notifications/${req.params.id}`, { headers });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to delete notification'
    });
  }
});

// Mark all notifications as read
router.post('/mark-all-read', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    await axios.post(`${API_BASE_URL}/notifications/mark-all-read`, {}, { headers });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to mark all notifications as read'
    });
  }
});

// Bulk delete notifications
router.delete('/bulk', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    const { notificationIds } = req.body;
    
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification IDs provided'
      });
    }
    
    await axios.delete(`${API_BASE_URL}/notifications/bulk`, { 
      headers,
      data: { notificationIds }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to delete notifications'
    });
  }
});

module.exports = router;