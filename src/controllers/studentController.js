// src/controllers/studentController.js
const eventService = require('../services/eventService');

const clubService = require('../services/clubService');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const events = await eventService.getUpcomingApprovedEvents();
    const clubs = await clubService.getAllActiveClubs();

    res.render('student/dashboard', {
      title: 'Student Dashboard',
      user: req.session.user,   // REQUIRED
      events: events || [],     // REQUIRED
      clubs: clubs || [],       // REQUIRED
      error: null,
      success: null
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      title: 'Error',
      error: err.message,
      statusCode: 500
    });
  }
};

exports.getDiscover = async (req, res) => {
  try {
    const events = await eventService.getApprovedEvents();

    res.render('student/discover', {
      title: 'Discover Events',
      events,
      error: null,
      success: null
    });

  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      error: err.message,
      statusCode: 500
    });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const events = await eventService.getStudentRegisteredEvents(userId);

    res.render('student/tickets', {
      title: 'My Tickets',
      events: events || [],
      user: req.session.user,
      error: null,
      success: null
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      title: 'Error',
      error: err.message,
      statusCode: 500
    });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { eventId } = req.params;

    const result = await eventService.registerStudentForEvent(eventId, userId);

 if (result.alreadyRegistered) {
  return res.redirect('/student/dashboard?message=already_registered');
}

if (result.full) {
  return res.redirect('/student/dashboard?message=event_full');
}

    res.redirect('/student/dashboard?message=registered');

  } catch (err) {
    console.error(err);
    res.redirect('/student/dashboard?message=error');
  }
};
exports.getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.session.user;

    const event = await eventService.getEventById(eventId);

    if (!event) {
      return res.status(404).render('error', {
        title: 'Not Found',
        error: 'Event not found',
        statusCode: 404
      });
    }

    const isRegistered = event.attendees.some(
      a => a.toString() === user._id.toString()
    );

    const canRegister =
      user.role === 'student' &&
      event.status === 'approved' &&
      !isRegistered &&
      event.attendees.length < event.capacity;

    const canApprove = user.role === 'admin';
    const canManage =
      user.role === 'club' &&
      event.club &&
      event.club._id.toString() === user._id.toString();

    res.render('events/details', {
      title: event.name,
      event,
      user,
      isRegistered,
      canRegister,
      canApprove,
      canManage,
      error: null,
      success: null
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      title: 'Error',
      error: err.message,
      statusCode: 500
    });
  }
};