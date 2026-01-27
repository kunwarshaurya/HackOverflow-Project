const Event = require('../models/Event');
const checkConflict = require('../utils/conflictChecker');

exports.createEvent = async (req, res) => {
  try {
    const { name, description, venue, date, startTime, endTime, budget } = req.body;

    const isConflict = await checkConflict(venue, date, startTime, endTime);
    if (isConflict) {
      return res.status(400).json({
        success: false,
        message: `Conflict detected! The ${venue} is already booked between ${startTime} and ${endTime} on this date.`
      });
    }

    const event = await Event.create({
      name,
      description,
      venue,
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
    const query =
      req.user && req.user.role === 'admin' ? {} : { status: 'approved' };

    const events = await Event.find(query)
      .populate('organizer', 'name email');

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    if (adminComments) {
      event.adminComments = adminComments;
    }

    await event.save();

    res.json({ success: true, data: event });
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
