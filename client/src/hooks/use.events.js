import { useState, useCallback } from 'react';
import eventService from '../services/event.service';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const result = await eventService.getAllEvents();
    if (result.success) {
      setEvents(result.data);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  // Create event wrapper
  const createNewEvent = async (eventData) => {
    setLoading(true);
    const result = await eventService.createEvent(eventData);
    setLoading(false);
    return result;
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createNewEvent
  };
};

export default useEvents;