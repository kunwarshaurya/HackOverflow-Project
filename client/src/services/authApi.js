const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9999/api';

class AuthAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  async register(userData) {
    try {
      const response = await axios.post(`${this.baseURL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }

  async login(credentials) {
    try {
      const response = await axios.post(`${this.baseURL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  createAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}

module.exports = new AuthAPI();