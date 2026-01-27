const Event = require('../models/Event');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const approvedEvents = await Event.countDocuments({ status: 'approved' });
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    const rejectedEvents = await Event.countDocuments({ status: 'rejected' });

    // sum budget for approved events only
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

    res.json({
      success: true,
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
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
