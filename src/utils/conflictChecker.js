// src/utils/conflictChecker.js

const Event = require('../models/Event');

/**
 * Check for venue booking conflicts using numeric time comparison.
 * startTime and endTime are minutes-from-midnight (0–1439).
 */
const checkConflict = async (venueId, date, startTime, endTime) => {
  const start = Number(startTime);
  const end = Number(endTime);

  if (isNaN(start) || isNaN(end)) {
    return false;
  }

  const existingEvents = await Event.find({
    venue: venueId,
    date: date,
    status: { $in: ['approved', 'pending'] }
  }).select('startTime endTime');

  for (const event of existingEvents) {
    // Overlap: new start < existing end AND new end > existing start
    if (start < event.endTime && end > event.startTime) {
      return true;
    }
  }
  return false;
};

module.exports = checkConflict;