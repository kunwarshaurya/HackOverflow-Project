const Club = require('../models/Club');
const Event = require('../models/Event');
const activityService = require('../services/activityService');
const analyticsService = require('../services/analyticsService');


// =========================
// Create Club
// =========================
exports.createClub = async (req, res) => {
  try {
    const { name, description, adminId } = req.body;

    await Club.create({
      name,
      description,
      admin: adminId || req.user.id
    });

    res.redirect('/dashboard');

  } catch (error) {
    console.error('Error creating club:', error.message);
    res.redirect('/dashboard');
  }
};


// =========================
// Get All Clubs (Admin View)
// =========================
exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    res.render('club/index', {
      title: 'Clubs',
      clubs,
      user: req.user
    });

  } catch (error) {
    console.error('Error getting clubs:', error.message);
    res.redirect('/dashboard');
  }
};


// =========================
// Club Dashboard (FULLY DYNAMIC)
// =========================
exports.dashboard = async (req, res) => {
  try {
    const [clubEvents, clubs, activities, clubAnalytics] = await Promise.all([
      Event.find({ organizer: req.user.id })
        .populate('venue', 'name')
        .sort({ createdAt: -1 }),
      Club.find({ admin: req.user.id }),
      activityService.getActivityFeed({ _id: req.user.id, role: 'club_lead' }, 10),
      analyticsService.getClubAnalytics(req.user.id)
    ]);

    const totalEvents = clubEvents.length;
    const activeEvents = clubEvents.filter(e => e.status === 'approved').length;
    const pendingEvents = clubEvents.filter(e => e.status === 'pending').length;
    const totalRegistrations = clubEvents.reduce((sum, event) => {
      return sum + (event.attendees ? event.attendees.length : 0);
    }, 0);
    const recentEvents = clubEvents.slice(0, 5);

    res.render('club/dashboard', {
      title: 'Club Dashboard',
      totalEvents,
      activeEvents,
      pendingEvents,
      totalRegistrations,
      recentEvents,
      clubs,
      activities,
      clubAnalytics,
      error: null,
      success: null,
      user: req.user
    });

  } catch (error) {
    console.error(error);
    res.render('club/dashboard', {
      title: 'Club Dashboard',
      totalEvents: 0,
      activeEvents: 0,
      pendingEvents: 0,
      totalRegistrations: 0,
      recentEvents: [],
      clubs: [],
      error: 'Something went wrong while loading dashboard',
      success: null,
      user: req.user
    });
  }
};