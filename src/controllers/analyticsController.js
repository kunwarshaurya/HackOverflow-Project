// src/controllers/analyticsController.js

const Event = require('../models/Event');
const Club = require('../models/Club');
const Venue = require('../models/Venue');
const Equipment = require('../models/Equipment');
const EquipmentBooking = require('../models/EquipmentBooking');
const mongoose = require('mongoose');

// ===================================================================
// AGGREGATION HELPERS
// ===================================================================

/**
 * Participation Trends — Monthly event registrations
 * Unwind attendees, group by year+month of event.date
 */
async function getParticipationTrends() {
  return Event.aggregate([
    { $match: { status: { $in: ['approved', 'completed'] } } },
    { $unwind: { path: '$attendees', preserveNullAndEmptyArrays: false } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        totalRegistrations: { $sum: 1 },
        uniqueEvents: { $addToSet: '$_id' }
      }
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalRegistrations: 1,
        eventCount: { $size: '$uniqueEvents' }
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);
}

/**
 * Club Activity Metrics —
 * Total events, registrations, status breakdown per club
 */
async function getClubActivity() {
  return Event.aggregate([
    { $match: { club: { $ne: null } } },
    {
      $group: {
        _id: '$club',
        totalEvents: { $sum: 1 },
        totalRegistrations: { $sum: { $size: { $ifNull: ['$attendees', []] } } },
        approved: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'clubs',
        localField: '_id',
        foreignField: '_id',
        as: 'clubInfo'
      }
    },
    { $unwind: { path: '$clubInfo', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        clubId: '$_id',
        clubName: { $ifNull: ['$clubInfo.name', 'Unknown Club'] },
        totalEvents: 1,
        totalRegistrations: 1,
        approved: 1,
        pending: 1,
        rejected: 1,
        completed: 1
      }
    },
    { $sort: { totalEvents: -1 } }
  ]);
}

/**
 * Venue Utilization — Events per venue
 */
async function getVenueUtilization() {
  return Event.aggregate([
    { $match: { status: { $in: ['approved', 'completed'] } } },
    {
      $group: {
        _id: '$venue',
        eventCount: { $sum: 1 },
        totalAttendees: { $sum: { $size: { $ifNull: ['$attendees', []] } } }
      }
    },
    {
      $lookup: {
        from: 'venues',
        localField: '_id',
        foreignField: '_id',
        as: 'venueInfo'
      }
    },
    { $unwind: { path: '$venueInfo', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        venueId: '$_id',
        venueName: { $ifNull: ['$venueInfo.name', 'Unknown Venue'] },
        eventCount: 1,
        totalAttendees: 1
      }
    },
    { $sort: { eventCount: -1 } }
  ]);
}

/**
 * Equipment Utilization — Approved bookings per equipment
 */
async function getEquipmentUtilization() {
  return EquipmentBooking.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$equipment',
        bookingCount: { $sum: 1 },
        totalQuantityUsed: { $sum: '$quantity' }
      }
    },
    {
      $lookup: {
        from: 'equipment',
        localField: '_id',
        foreignField: '_id',
        as: 'equipmentInfo'
      }
    },
    { $unwind: { path: '$equipmentInfo', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        equipmentId: '$_id',
        equipmentName: { $ifNull: ['$equipmentInfo.name', 'Unknown'] },
        category: { $ifNull: ['$equipmentInfo.category', ''] },
        bookingCount: 1,
        totalQuantityUsed: 1
      }
    },
    { $sort: { bookingCount: -1 } }
  ]);
}

/**
 * Budget Analysis — Total, per-club, and monthly
 */
async function getBudgetAnalysis() {
  const [totalBudget, budgetByClub, monthlyBudget] = await Promise.all([
    // Total approved budget
    Event.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$budget' }, count: { $sum: 1 } } }
    ]),

    // Budget per club
    Event.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] }, club: { $ne: null } } },
      {
        $group: {
          _id: '$club',
          totalBudget: { $sum: '$budget' },
          eventCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'clubs',
          localField: '_id',
          foreignField: '_id',
          as: 'clubInfo'
        }
      },
      { $unwind: { path: '$clubInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          clubName: { $ifNull: ['$clubInfo.name', 'Unknown'] },
          totalBudget: 1,
          eventCount: 1
        }
      },
      { $sort: { totalBudget: -1 } }
    ]),

    // Monthly budget allocation
    Event.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalBudget: { $sum: '$budget' },
          eventCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalBudget: 1,
          eventCount: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ])
  ]);

  return {
    total: totalBudget.length > 0 ? totalBudget[0].total : 0,
    approvedCount: totalBudget.length > 0 ? totalBudget[0].count : 0,
    byClub: budgetByClub,
    monthly: monthlyBudget
  };
}

// ===================================================================
// ROUTE HANDLERS
// ===================================================================

/**
 * GET /admin/analytics — Main analytics page
 */
exports.getAnalyticsPage = async (req, res) => {
  try {
    const [participation, clubActivity, venueUtil, equipmentUtil, budget] =
      await Promise.all([
        getParticipationTrends(),
        getClubActivity(),
        getVenueUtilization(),
        getEquipmentUtilization(),
        getBudgetAnalysis()
      ]);

    res.render('admin/analytics', {
      title: 'Analytics Dashboard',
      participation,
      clubActivity,
      venueUtil,
      equipmentUtil,
      budget
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to load analytics',
      statusCode: 500
    });
  }
};

/**
 * GET /admin/analytics/export?type=participation|club|resource|budget
 * Returns downloadable CSV
 */
exports.exportCSV = async (req, res) => {
  try {
    const { Parser } = require('json2csv');
    const type = req.query.type;

    let data = [];
    let fields = [];
    let filename = 'export.csv';

    switch (type) {
      case 'participation': {
        data = await getParticipationTrends();
        fields = ['year', 'month', 'totalRegistrations', 'eventCount'];
        filename = 'participation_trends.csv';
        break;
      }
      case 'club': {
        data = await getClubActivity();
        fields = ['clubName', 'totalEvents', 'totalRegistrations', 'approved', 'pending', 'rejected', 'completed'];
        filename = 'club_activity.csv';
        break;
      }
      case 'resource': {
        const venueData = await getVenueUtilization();
        const equipData = await getEquipmentUtilization();

        const venueRows = venueData.map(v => ({
          type: 'Venue',
          name: v.venueName,
          category: '',
          usageCount: v.eventCount,
          totalQuantity: v.totalAttendees
        }));
        const equipRows = equipData.map(e => ({
          type: 'Equipment',
          name: e.equipmentName,
          category: e.category,
          usageCount: e.bookingCount,
          totalQuantity: e.totalQuantityUsed
        }));

        data = [...venueRows, ...equipRows];
        fields = ['type', 'name', 'category', 'usageCount', 'totalQuantity'];
        filename = 'resource_utilization.csv';
        break;
      }
      case 'budget': {
        const budgetData = await getBudgetAnalysis();
        data = budgetData.byClub.map(b => ({
          clubName: b.clubName,
          eventCount: b.eventCount,
          totalBudget: b.totalBudget
        }));
        // Add total row
        data.push({
          clubName: 'TOTAL',
          eventCount: budgetData.approvedCount,
          totalBudget: budgetData.total
        });
        fields = ['clubName', 'eventCount', 'totalBudget'];
        filename = 'budget_analysis.csv';
        break;
      }
      default:
        return res.status(400).send('Invalid export type. Use: participation, club, resource, or budget');
    }

    const parser = new Parser({ fields });
    const csv = parser.parse(data.length > 0 ? data : [{}]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).send('Failed to generate CSV export');
  }
};

// ===================================================================
// EXISTING ENDPOINTS (kept for backward compatibility)
// ===================================================================

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const approvedEvents = await Event.countDocuments({ status: 'approved' });
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    const rejectedEvents = await Event.countDocuments({ status: 'rejected' });

    const budgetStats = await Event.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: null, totalBudget: { $sum: '$budget' } } }
    ]);

    const totalBudgetUsed = budgetStats.length > 0 ? budgetStats[0].totalBudget : 0;

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
    res.redirect('/dashboard');
  }
};
