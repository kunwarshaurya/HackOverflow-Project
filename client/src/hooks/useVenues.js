import { useState, useCallback } from 'react';
import venueService from '../services/venue.service';

const useVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all venues
  const fetchVenues = useCallback(async () => {
    setLoading(true);
    const result = await venueService.getAllVenues();
    if (result.success) {
      setVenues(result.data);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  // Book venue wrapper
  const bookVenue = async (venueId, bookingData) => {
    setLoading(true);
    const result = await venueService.bookVenue(venueId, bookingData);
    if (result.success) {
      // Refresh venues list to update availability
      await fetchVenues();
    }
    setLoading(false);
    return result;
  };

  // Check availability wrapper
  const checkAvailability = async (venueId, date, startTime, endTime) => {
    const result = await venueService.checkAvailability(venueId, date, startTime, endTime);
    return result;
  };

  // Create venue wrapper
  const createNewVenue = async (venueData) => {
    setLoading(true);
    const result = await venueService.createVenue(venueData);
    if (result.success) {
      // Refresh venues list
      await fetchVenues();
    }
    setLoading(false);
    return result;
  };

  return {
    venues,
    loading,
    error,
    fetchVenues,
    bookVenue,
    checkAvailability,
    createNewVenue
  };
};

export default useVenues;