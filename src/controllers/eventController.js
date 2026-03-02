// src/controllers/eventController.js

const Event = require('../models/Event');
const Venue = require('../models/Venue');
const EquipmentBooking = require('../models/EquipmentBooking');
const Equipment = require('../models/Equipment');
const checkConflict = require('../utils/conflictChecker');
const checkEquipmentConflict = require('../utils/equipmentConflictChecker');
const notificationService = require('../services/notificationService');

/**
 * Convert "HH:MM" string to minutes-from-midnight integer.
 * "14:30" → 870
 */
function timeToMinutes(timeStr) {
  if (typeof timeStr === 'number') return timeStr;
  const parts = String(timeStr).split(':');
  if (parts.length !== 2) return NaN;
  const hours = parseInt(parts[0], 10);
  const mins = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(mins)) return NaN;
  return hours * 60 + mins;
}

exports.createEvent = async (req, res) => {
  try {
    const { name, description, venueId, clubId, date, startTime, endTime, budget, collaboratorIds } = req.body;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (isNaN(startMinutes) || isNaN(endMinutes)) {
      return res.redirect('/club/create-event');
    }

    if (endMinutes <= startMinutes) {
      return res.redirect('/club/create-event');
    }

    const venueDetails = await Venue.findById(venueId);
    if (!venueDetails) {
      return res.redirect('/club/create-event');
    }

    const isConflict = await checkConflict(venueId, date, startMinutes, endMinutes);

    if (isConflict) {
      return res.redirect('/club/create-event');
    }

    let collaboratorsList = [];
    if (collaboratorIds && Array.isArray(collaboratorIds)) {
      collaboratorsList = collaboratorIds.map(id => ({
        club: id,
        role: 'Co-Host',
        status: 'accepted'
      }));
    }

    const event = await Event.create({
      name,
      description,
      venue: venueId,
      club: clubId,
      collaborators: collaboratorsList,
      date,
      startTime: startMinutes,
      endTime: endMinutes,
      budget,
      organizer: req.user.id
    });

    // ===== Equipment Booking Requests =====
    let equipmentIds = req.body['equipmentIds[]'] || req.body.equipmentIds || [];
    let equipmentQtys = req.body['equipmentQtys[]'] || req.body.equipmentQtys || [];

    // Normalize to arrays
    if (!Array.isArray(equipmentIds)) equipmentIds = [equipmentIds];
    if (!Array.isArray(equipmentQtys)) equipmentQtys = [equipmentQtys];

    for (let i = 0; i < equipmentIds.length; i++) {
      const eqId = equipmentIds[i];
      const qty = Number(equipmentQtys[i]);

      if (!eqId || isNaN(qty) || qty < 1) continue;

      // Check availability before creating booking
      const conflictResult = await checkEquipmentConflict(eqId, date, startMinutes, endMinutes, qty);

      if (!conflictResult.conflict) {
        const booking = await EquipmentBooking.create({
          equipment: eqId,
          event: event._id,
          bookedBy: req.user.id,
          date,
          startTime: startMinutes,
          endTime: endMinutes,
          quantity: qty,
          status: 'pending'
        });

        // Notify admins of new booking request
        const eqDoc = await Equipment.findById(eqId).select('name');
        const eqName = eqDoc ? eqDoc.name : 'equipment';
        await notificationService.notifyAdminsOfBooking(booking, eqName);
      }
    }

    res.redirect('/dashboard');
  } catch (error) {
    res.redirect('/dashboard');
  }
};


exports.getEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    let query = {};

    // Role-based filtering
    if (req.user.role === 'student') {
      query.status = 'approved';
    }

    const { history } = req.query;

    if (history === 'true') {
      query.date = { $lt: currentDate };
    } else {
      query.date = { $gte: currentDate };
    }

    const events = await Event.find(query)
      .populate('club', 'name')
      .populate('venue', 'name')
      .sort({ date: history === 'true' ? -1 : 1 });

    res.render('events/index', {
      title: 'Events',
      events,
      count: events.length,
      history,
      user: req.user
    });

  } catch (error) {
    res.redirect('/dashboard');
  }
};

// @desc    Update event status (Admin Only)
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['approved', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.redirect('/admin/approvals');
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.redirect('/admin/approvals');
    }

    // Only allow status change if event is still pending
    if (event.status !== 'pending') {
      return res.redirect('/admin/approvals');
    }

    event.status = status;
    await event.save();

    // Send notification via service
    await notificationService.notifyEventStatusChange(event, status);

    res.redirect('/admin/approvals');

  } catch (error) {
    res.redirect('/admin/approvals');
  }
};

exports.settleEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect('back');
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).render('error', {
        title: 'Not Found',
        error: 'Event not found',
        statusCode: 404
      });
    }

    event.status = 'completed';
    event.receiptUrl = `/${req.file.path}`;

    await event.save();

    res.redirect('/dashboard');
  } catch (error) {
    res.redirect('/dashboard');
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).render('error', {
        title: 'Not Found',
        error: 'Event not found',
        statusCode: 404
      });
    }

    if (event.status !== 'approved') {
      return res.redirect(`/student/events/${event._id}`);
    }

    if (event.attendees.length >= event.capacity) {
      return res.redirect(`/student/events/${event._id}`);
    }

    if (event.attendees.some(att => att.toString() === req.user.id.toString())) {
      return res.redirect(`/student/events/${event._id}`);
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.redirect(`/student/events/${event._id}`);

  } catch (error) {
    res.redirect('/dashboard');
  }
};