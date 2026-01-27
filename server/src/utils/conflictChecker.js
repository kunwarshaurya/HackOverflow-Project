const Event = require('../models/Event');

const checkConflict = async (venue, date, startTime, endTime) => {
  const existingEvents = await Event.find({
    venue,
    date,
    status: 'approved'
  });

  // HH:MM string comparison
  for (const event of existingEvents) {
    if (startTime < event.endTime && endTime > event.startTime) {
      return true;
    }
  }

  return false;
};

module.exports = checkConflict;
