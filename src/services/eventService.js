// src/services/eventService.js

const Event = require('../models/Event');
require('../models/Club');
require('../models/Venue');

exports.getApprovedEvents = async () => {
  return await Event.find({ status: 'approved' })
    .populate('club')
    .populate('venue')
    .sort({ date: 1 });
};

exports.getStudentTickets = async (userId) => {
  return await Event.find({
    attendees: userId,
    status: 'approved'
  })
    .populate('club')
    .populate('venue')
    .sort({ date: 1 });
};

exports.getUpcomingApprovedEvents = async () => {
  const today = new Date();

  return await Event.find({
    status: 'approved',
    date: { $gte: today }
  })
    .populate('club')
    .populate('venue')
    .sort({ date: 1 });
};


exports.getStudentDashboardStats = async (userId) => {
  const totalApprovedEvents = await Event.countDocuments({
    status: 'approved'
  });

  const registeredEvents = await Event.countDocuments({
    attendees: userId,
    status: 'approved'
  });

  return {
    totalApprovedEvents,
    registeredEvents
  };
};
exports.registerStudentForEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.status !== 'approved') {
    throw new Error('Event is not open for registration');
  }

  if (event.attendees.includes(userId)) {
    return { alreadyRegistered: true };
  }

  if (event.attendees.length >= event.capacity) {
    return { full: true };
  }

  event.attendees.push(userId);
  await event.save();

  return { success: true };
};
exports.getStudentRegisteredEvents = async (userId) => {
  return await Event.find({
    attendees: userId
  })
    .populate('club')
    .populate('venue')
    .sort({ date: 1 });
};
exports.getEventById = async (eventId) => {
  return await Event.findById(eventId)
    .populate('club')
    .populate('venue')
    .populate('organizer');
};