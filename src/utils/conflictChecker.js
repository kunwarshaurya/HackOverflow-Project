const Event = require('../models/Event');

const checkConflict = async (venueId, date, startTime, endTime) => {
  const existingEvents = await Event.find({
    venue: venueId, 
    date: date,
    status: 'approved'
  });

  for (const event of existingEvents) {
    if (startTime < event.endTime && endTime > event.startTime) {
      return true;
    }
  }
  return false;
};

module.exports = checkConflict;