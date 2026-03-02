// src/services/analyticsService.js
// Read-only analytics layer using MongoDB aggregation pipelines.

const Event = require('../models/Event');
const Venue = require('../models/Venue');

// ======================================================================
// ADMIN ANALYTICS
// ======================================================================
/**
 * Returns platform-wide analytics for the admin dashboard.
 *
 * Aggregation pipeline:
 *   $group → groups all events, counts by status, sums attendees, collects per-event sizes
 *   Result is a single document with all counts + computed ratios.
 *
 * Top 3 events: separate query sorted by attendees array length using $addFields + $sort.
 */
exports.getAdminAnalytics = async () => {
    // ── Pipeline 1: Summary stats via $facet for single-pass efficiency ──
    const [summary] = await Event.aggregate([
        {
            $facet: {
                statusCounts: [
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ],
                registrationStats: [
                    {
                        $group: {
                            _id: null,
                            totalEvents: { $sum: 1 },
                            totalRegistrations: { $sum: { $size: { $ifNull: ['$attendees', []] } } },
                            avgRegistrations: { $avg: { $size: { $ifNull: ['$attendees', []] } } }
                        }
                    }
                ]
            }
        }
    ]);

    // Parse status counts
    const statusMap = {};
    (summary.statusCounts || []).forEach(s => { statusMap[s._id] = s.count; });

    const totalEvents = (statusMap.approved || 0) + (statusMap.pending || 0) +
        (statusMap.rejected || 0) + (statusMap.completed || 0);
    const approvedCount = statusMap.approved || 0;
    const rejectedCount = statusMap.rejected || 0;
    const completedCount = statusMap.completed || 0;
    const approvalRatio = totalEvents > 0
        ? Math.round(((approvedCount + completedCount) / totalEvents) * 100)
        : 0;

    const regStats = (summary.registrationStats && summary.registrationStats[0]) || {};
    const avgRegistrations = Math.round((regStats.avgRegistrations || 0) * 10) / 10;
    const totalRegistrations = regStats.totalRegistrations || 0;

    // ── Pipeline 2: Top 3 events by registration count ──
    const topEvents = await Event.aggregate([
        { $addFields: { regCount: { $size: { $ifNull: ['$attendees', []] } } } },
        { $sort: { regCount: -1 } },
        { $limit: 3 },
        {
            $lookup: {
                from: 'venues',
                localField: 'venue',
                foreignField: '_id',
                as: 'venueInfo'
            }
        },
        {
            $project: {
                name: 1,
                regCount: 1,
                status: 1,
                date: 1,
                capacity: 1,
                venueName: { $arrayElemAt: ['$venueInfo.name', 0] }
            }
        }
    ]);

    return {
        totalEvents,
        approvedCount,
        rejectedCount,
        completedCount,
        approvalRatio,
        avgRegistrations,
        totalRegistrations,
        topEvents
    };
};

// ======================================================================
// VENUE ANALYTICS
// ======================================================================
/**
 * Aggregation pipeline:
 *   $group by venue → count events per venue
 *   $lookup to join venue name
 *   $sort descending by event count
 *
 * Returns { venues[], mostUsed, leastUsed }.
 */
exports.getVenueAnalytics = async () => {
    const venueStats = await Event.aggregate([
        {
            $group: {
                _id: '$venue',
                eventCount: { $sum: 1 },
                totalRegistrations: { $sum: { $size: { $ifNull: ['$attendees', []] } } }
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
                venueId: '$_id',
                name: { $ifNull: ['$venueInfo.name', 'Unknown Venue'] },
                eventCount: 1,
                totalRegistrations: 1
            }
        },
        { $sort: { eventCount: -1 } }
    ]);

    return {
        venues: venueStats,
        mostUsed: venueStats.length > 0 ? venueStats[0] : null,
        leastUsed: venueStats.length > 0 ? venueStats[venueStats.length - 1] : null
    };
};

// ======================================================================
// CLUB ANALYTICS (per club_lead)
// ======================================================================
/**
 * Aggregation pipeline:
 *   $match → filter to events by this organizer
 *   $facet → statusCounts + registrationStats in one pass
 *
 * Returns { eventsHosted, approvalRate, completionRate, avgRegistrations }.
 */
exports.getClubAnalytics = async (clubLeadId) => {
    const mongoose = require('mongoose');
    const organizerId = new mongoose.Types.ObjectId(clubLeadId);

    const [result] = await Event.aggregate([
        { $match: { organizer: organizerId } },
        {
            $facet: {
                statusCounts: [
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ],
                regStats: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            totalRegs: { $sum: { $size: { $ifNull: ['$attendees', []] } } },
                            avgRegs: { $avg: { $size: { $ifNull: ['$attendees', []] } } }
                        }
                    }
                ]
            }
        }
    ]);

    const statusMap = {};
    (result.statusCounts || []).forEach(s => { statusMap[s._id] = s.count; });

    const eventsHosted = (statusMap.approved || 0) + (statusMap.pending || 0) +
        (statusMap.rejected || 0) + (statusMap.completed || 0);
    const approved = (statusMap.approved || 0) + (statusMap.completed || 0);
    const completed = statusMap.completed || 0;

    const approvalRate = eventsHosted > 0 ? Math.round((approved / eventsHosted) * 100) : 0;
    const completionRate = eventsHosted > 0 ? Math.round((completed / eventsHosted) * 100) : 0;

    const reg = (result.regStats && result.regStats[0]) || {};

    return {
        eventsHosted,
        approvedCount: statusMap.approved || 0,
        rejectedCount: statusMap.rejected || 0,
        completedCount: completed,
        pendingCount: statusMap.pending || 0,
        approvalRate,
        completionRate,
        avgRegistrations: Math.round((reg.avgRegs || 0) * 10) / 10,
        totalRegistrations: reg.totalRegs || 0
    };
};
