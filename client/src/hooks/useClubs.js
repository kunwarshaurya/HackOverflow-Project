import { useState, useCallback } from 'react';
import clubService from '../services/club.service';

const useClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all clubs
  const fetchClubs = useCallback(async () => {
    setLoading(true);
    const result = await clubService.getAllClubs();
    if (result.success) {
      setClubs(result.data);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  // Create club wrapper
  const createNewClub = async (clubData) => {
    setLoading(true);
    const result = await clubService.createClub(clubData);
    if (result.success) {
      // Refresh clubs list
      await fetchClubs();
    }
    setLoading(false);
    return result;
  };

  // Join club wrapper
  const joinClub = async (clubId) => {
    setLoading(true);
    const result = await clubService.joinClub(clubId);
    if (result.success) {
      // Refresh clubs list to update membership status
      await fetchClubs();
    }
    setLoading(false);
    return result;
  };

  // Leave club wrapper
  const leaveClub = async (clubId) => {
    setLoading(true);
    const result = await clubService.leaveClub(clubId);
    if (result.success) {
      // Refresh clubs list to update membership status
      await fetchClubs();
    }
    setLoading(false);
    return result;
  };

  return {
    clubs,
    loading,
    error,
    fetchClubs,
    createNewClub,
    joinClub,
    leaveClub
  };
};

export default useClubs;