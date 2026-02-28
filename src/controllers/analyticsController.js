const Event = require('../models/Event');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const approvedEvents = await Event.countDocuments({ status: 'approved' });
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    const rejectedEvents = await Event.countDocuments({ status: 'rejected' });

    const budgetStats = await Event.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, totalBudget: { $sum: '$budget' } } }
    ]);

    const totalBudgetUsed =
      budgetStats.length > 0 ? budgetStats[0].totalBudget : 0;

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name status organizer date');

    res.render('admin/dashboard', {
      title: 'Analytics Dashboard',
      data: {
        counts: {
          total: totalEvents,
          approved: approvedEvents,
          pending: pendingEvents,
          rejected: rejectedEvents
        },
        budget: {
          totalUsed: totalBudgetUsed,
          currency: 'INR'
        },
        recentActivity: recentEvents
      },
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    res.redirect('/dashboard');
  }
};

exports.getClubStats = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.redirect('/dashboard');
    }

    const eventCount = await Event.countDocuments({
      $or: [
        { club: clubId },
        { 'collaborators.club': clubId }
      ]
    });

    // budget counted only when club is primary host
    const budgetData = await Event.aggregate([
      { $match: { club: new mongoose.Types.ObjectId(clubId) } },
      { $group: { _id: null, totalBudget: { $sum: '$budget' } } }
    ]);

    res.render('club/stats', {
      title: 'Club Stats',
      data: {
        clubId,
        totalEvents: eventCount,
        managedBudget: budgetData[0] ? budgetData[0].totalBudget : 0
      },
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching club stats:', error.message);
    res.redirect('/dashboard');
  }
};
