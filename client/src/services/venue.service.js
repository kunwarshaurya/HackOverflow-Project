import api from './api';

const getAllVenues = async () => {
  try {
    const response = await api.get('/venues');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch venues' 
    };
  }
};

const getVenueById = async (venueId) => {
  try {
    const response = await api.get(`/venues/${venueId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch venue' 
    };
  }
};

const createVenue = async (venueData) => {
  try {
    const response = await api.post('/venues', venueData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to create venue' 
    };
  }
};

const updateVenue = async (venueId, venueData) => {
  try {
    const response = await api.put(`/venues/${venueId}`, venueData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update venue' 
    };
  }
};

const bookVenue = async (venueId, bookingData) => {
  try {
    const response = await api.post(`/venues/${venueId}/book`, bookingData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to book venue' 
    };
  }
};

const checkAvailability = async (venueId, date, startTime, endTime) => {
  try {
    const response = await api.get(`/venues/${venueId}/availability`, {
      params: { date, startTime, endTime }
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to check availability' 
    };
  }
};

export default {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  bookVenue,
  checkAvailability
};