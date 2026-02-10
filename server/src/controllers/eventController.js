const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Notification = require('../models/Notification'); 
const checkConflict = require('../utils/conflictChecker');

exports.createEvent = async (req, res) => {
  try {

    const { name, description, venueId, clubId, date, startTime, endTime, budget,collaboratorIds } = req.body;

    const venueDetails = await Venue.findById(venueId);
    if (!venueDetails) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const isConflict = await checkConflict(venueId, date, startTime, endTime);
    
    if (isConflict) {
      return res.status(400).json({
        success: false,
        message: `Conflict detected! The ${venueDetails.name} is already booked.`
      });
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
      startTime,
      endTime,
      budget,
      organizer: req.user.id
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event request submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getEvents = async (req, res) => {
  try {
    let query = {};

    // Role-based filtering

    if (req.user.role === 'student') {
      query.status = 'approved';
    }

    // If frontend sends ?history=true, show PAST events.
    // Otherwise, show UPCOMING events.
    const { history } = req.query;
    const currentDate = new Date();

    if (history === 'true') {
  
      query.date = { $lt: currentDate }; 
    } else {

      query.date = { $gte: currentDate }; 
    }

    const events = await Event.find(query)
      .populate('club', 'name')
      .populate('venue', 'name')
      .sort({ date: history === 'true' ? -1 : 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event status (Admin Only)
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    await event.save();

    //notification
    const message = `Your event "${event.name}" has been ${status}.`;
    
    await Notification.create({
      recipient: event.organizer, 
      message: message,
      type: status === 'approved' ? 'success' : 'error', 
      relatedEvent: event._id
    });
    // ------------------------------------

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.settleEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a receipt/proof file'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'completed';
    event.receiptUrl = `/${req.file.path}`;

    await event.save();

    res.json({
      success: true,
      message: 'Event settled and receipts uploaded',
      data: event
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
  
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    
    event.attendees.push(req.user.id);
    await event.save();

    res.status(200).json({ 
      success: true, 
      message: 'Successfully registered for event',
      data: event 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
