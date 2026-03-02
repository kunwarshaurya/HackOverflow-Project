// src/services/activityService.js

const Notification = require('../models/Notification');
const Event = require('../models/Event');

/**
 * Icon + color mapping for each activity category.
 */
const ACTIVITY_META = {
    EVENT_CREATED: { icon: 'fa-plus-circle', color: '#667eea', title: 'Event Created' },
    EVENT_APPROVED: { icon: 'fa-check-circle', color: '#48bb78', title: 'Event Approved' },
    EVENT_REJECTED: { icon: 'fa-times-circle', color: '#e53e3e', title: 'Event Rejected' },
    EVENT_COMPLETED: { icon: 'fa-flag-checkered', color: '#805ad5', title: 'Event Completed' },
    BOOKING_CREATED: { icon: 'fa-box', color: '#4299e1', title: 'Equipment Booking Requested' },
    BOOKING_APPROVED: { icon: 'fa-thumbs-up', color: '#48bb78', title: 'Booking Approved' },
    BOOKING_REJECTED: { icon: 'fa-thumbs-down', color: '#e53e3e', title: 'Booking Rejected' },
    REMINDER_SENT: { icon: 'fa-bell', color: '#ed8936', title: 'Reminder Sent' },
    GENERAL: { icon: 'fa-info-circle', color: '#718096', title: 'Notification' }
};

/**
 * Normalize a Notification document into a unified activity item.
 */
function notificationToActivity(n) {
    const cat = n.category || 'GENERAL';
    const meta = ACTIVITY_META[cat] || ACTIVITY_META.GENERAL;
    return {
        type: cat,
        icon: meta.icon,
        color: meta.color,
        title: meta.title,
        description: n.message,
        relatedEntityId: n.relatedEvent || n.relatedBooking || null,
        createdAt: n.createdAt
    };
}

/**
 * Normalize an Event document into a unified activity item.
 * Used for events that may not have matching notifications (e.g. created events).
 */
function eventToActivity(e) {
    const statusMap = {
        pending: { type: 'EVENT_CREATED', icon: 'fa-plus-circle', color: '#667eea', title: 'Event Created' },
        approved: { type: 'EVENT_APPROVED', icon: 'fa-check-circle', color: '#48bb78', title: 'Event Approved' },
        rejected: { type: 'EVENT_REJECTED', icon: 'fa-times-circle', color: '#e53e3e', title: 'Event Rejected' },
        completed: { type: 'EVENT_COMPLETED', icon: 'fa-flag-checkered', color: '#805ad5', title: 'Event Completed' }
    };
    const meta = statusMap[e.status] || statusMap.pending;
    return {
        type: meta.type,
        icon: meta.icon,
        color: meta.color,
        title: meta.title,
        description: `"${e.name}" — ${e.status}`,
        relatedEntityId: e._id,
        createdAt: e.updatedAt || e.createdAt
    };
}

/**
 * Get a role-aware activity feed for a user.
 *
 * - admin: sees recent notifications (all categories) + recent events
 * - club_lead: sees own notifications + own events
 * - student: sees own notifications
 *
 * @param {Object} user - Must have _id and role
 * @param {number} limit - Max items (default 20)
 * @returns {Array} Sorted activity items (newest first)
 */
async function getActivityFeed(user, limit = 20) {
    const activities = [];

    try {
        if (user.role === 'admin') {
            // Admin: global view — recent notifications + recent events
            const [notifications, events] = await Promise.all([
                Notification.find()
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .lean(),
                Event.find()
                    .sort({ updatedAt: -1 })
                    .limit(10)
                    .select('name status createdAt updatedAt')
                    .lean()
            ]);

            notifications.forEach(n => activities.push(notificationToActivity(n)));
            events.forEach(e => activities.push(eventToActivity(e)));

        } else if (user.role === 'club_lead') {
            // Club lead: own notifications + own events
            const [notifications, events] = await Promise.all([
                Notification.find({ recipient: user._id })
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .lean(),
                Event.find({ organizer: user._id })
                    .sort({ updatedAt: -1 })
                    .limit(10)
                    .select('name status createdAt updatedAt')
                    .lean()
            ]);

            notifications.forEach(n => activities.push(notificationToActivity(n)));
            events.forEach(e => activities.push(eventToActivity(e)));

        } else {
            // Student: own notifications only
            const notifications = await Notification.find({ recipient: user._id })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            notifications.forEach(n => activities.push(notificationToActivity(n)));
        }
    } catch (err) {
        console.error('[ActivityService] getActivityFeed error:', err.message);
    }

    // Deduplicate by relatedEntityId+type, keep newest
    const seen = new Set();
    const deduped = [];
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    for (const item of activities) {
        const key = `${item.type}:${item.relatedEntityId || Math.random()}`;
        if (!seen.has(key)) {
            seen.add(key);
            deduped.push(item);
        }
    }

    return deduped.slice(0, limit);
}

module.exports = { getActivityFeed, ACTIVITY_META };
