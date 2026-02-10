import api from './api';

const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch notifications' 
    };
  }
};

const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to mark notification as read' 
    };
  }
};

const markAllAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to mark all notifications as read' 
    };
  }
};

const createNotification = async (notificationData) => {
  try {
    const response = await api.post('/notifications', notificationData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to create notification' 
    };
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
};