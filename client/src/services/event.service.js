import api from './api';

const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to create event' 
    };
  }
};

const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch events' 
    };
  }
};

const updateEventStatus = async (eventId, status, adminComments = '') => {
  try {
    const response = await api.put(`/events/${eventId}/status`, { 
      status, 
      adminComments 
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update status' 
    };
  }
};

// Uses FormData for file upload
const settleEvent = async (eventId, file) => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await api.post(`/events/${eventId}/settle`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to upload receipt' 
    };
  }
};

export default {
  createEvent,
  getAllEvents,
  updateEventStatus,
  settleEvent
};