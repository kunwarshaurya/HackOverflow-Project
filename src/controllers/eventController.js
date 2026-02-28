const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Notification = require('../models/Notification');
const checkConflict = require('../utils/conflictChecker');

exports.createEvent = async (req, res) => {
  try {

    const { name, description, venueId, clubId, date, startTime, endTime, budget, collaboratorIds } = req.body;

    const venueDetails = await Venue.findById(venueId);
    if (!venueDetails) {
      return res.redirect('/club/create-event'); // Flash error realistically
    }

    const isConflict = await checkConflict(venueId, date, startTime, endTime);

    if (isConflict) {
      // Typically flash error is set
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
      startTime,
      endTime,
      budget,
      organizer: req.user.id
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.redirect('/dashboard');
  }
};


exports.getEvents = async (req, res) => {
  try {

    const currentDate = new Date();

    // 🔥 Auto-complete past approved events
    await Event.updateMany(
      {
        status: 'approved',
        date: { $lt: currentDate }
      },
      {
        $set: { status: 'completed' }
      }
    );

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
    console.error('Error fetching events:', error.message);
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
      console.log("Attempted invalid status change");
      return res.redirect('/admin/approvals');
    }

    event.status = status;
    await event.save();

    // Send notification
    await Notification.create({
      recipient: event.organizer,
      message: `Your event "${event.name}" has been ${status}.`,
      type: status === 'approved' ? 'success' : 'error',
      relatedEvent: event._id
    });

    res.redirect('/admin/approvals');

  } catch (error) {
    console.error('Error updating event status:', error.message);
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
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'completed';
    event.receiptUrl = `/${req.file.path}`;

    await event.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error settling event:', error.message);
    res.redirect('/dashboard');
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).render('error');
    }

    // ❌ Block if not approved
    if (event.status !== 'approved') {
      return res.redirect(`/student/events/${event._id}`);
    }

    // ❌ Block if event full
    if (event.attendees.length >= event.capacity) {
      return res.redirect(`/student/events/${event._id}`);
    }

    // ❌ Block duplicate registration (safe check)
    if (event.attendees.some(att => att.toString() === req.user.id.toString())) {
      return res.redirect(`/student/events/${event._id}`);
    }

    // ✅ Register user
    event.attendees.push(req.user.id);
    await event.save();

    res.redirect(`/student/events/${event._id}`);

  } catch (error) {
    console.error('Error registering for event:', error.message);
    res.redirect('/dashboard');
  }
};