import api from './api';

const getAllClubs = async () => {
  try {
    const response = await api.get('/clubs');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch clubs' 
    };
  }
};

const getClubById = async (clubId) => {
  try {
    const response = await api.get(`/clubs/${clubId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch club' 
    };
  }
};

const createClub = async (clubData) => {
  try {
    const response = await api.post('/clubs', clubData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to create club' 
    };
  }
};

const updateClub = async (clubId, clubData) => {
  try {
    const response = await api.put(`/clubs/${clubId}`, clubData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update club' 
    };
  }
};

const joinClub = async (clubId) => {
  try {
    const response = await api.post(`/clubs/${clubId}/join`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to join club' 
    };
  }
};

const leaveClub = async (clubId) => {
  try {
    const response = await api.post(`/clubs/${clubId}/leave`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to leave club' 
    };
  }
};

export default {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  joinClub,
  leaveClub
};