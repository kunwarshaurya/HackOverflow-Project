import api from './api';

const getDashboardStats = async () => {
  try {
    const response = await api.get('/analytics/dashboard');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch analytics' 
    };
  }
};

export default {
  getDashboardStats
};