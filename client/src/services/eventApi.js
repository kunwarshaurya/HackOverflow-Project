const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999/api';

class EventAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/events`;
  }

  createAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getEvents(token, history = false) {
    try {
      const response = await axios.get(`${this.baseURL}?history=${history}`, {
        headers: this.createAuthHeaders(token)
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch events' };
    }
  }

  async createEvent(token, eventData) {
    try {
      const response = await axios.post(this.baseURL, eventData, {
        headers: this.createAuthHeaders(token)
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create event' };
    }
  }

  async updateEventStatus(token, eventId, status) {
    try {
      const response = await axios.put(`${this.baseURL}/${eventId}/status`, 
        { status }, 
        { headers: this.createAuthHeaders(token) }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update event status' };
    }
  }

  async registerForEvent(token, eventId) {
    try {
      const response = await axios.post(`${this.baseURL}/${eventId}/register`, {}, {
        headers: this.createAuthHeaders(token)
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register for event' };
    }
  }

  async settleEvent(token, eventId, formData) {
    try {
      const response = await axios.post(`${this.baseURL}/${eventId}/settle`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to settle event' };
    }
  }
}

module.exports = new EventAPI();