export const validateEventTimes = (startTime, endTime) => {
  // Regex for HH:MM 24-hour format
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return 'Times must be in 24-hour format (HH:MM)';
  }

  // String comparison works for 24h format strings (e.g. "14:00" > "09:00")
  if (startTime >= endTime) {
    return 'End time must be after start time';
  }

  return null;
};