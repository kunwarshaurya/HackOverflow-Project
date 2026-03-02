// src/services/notificationService.js

const Notification = require('../models/Notification');
const User = require('../models/user');

// ─── Standardized Category Constants ─────────────────────────────────
const CATEGORIES = Object.freeze({
    EVENT_CREATED: 'EVENT_CREATED',
    EVENT_APPROVED: 'EVENT_APPROVED',
    EVENT_REJECTED: 'EVENT_REJECTED',
    EVENT_COMPLETED: 'EVENT_COMPLETED',
    BOOKING_CREATED: 'BOOKING_CREATED',
    BOOKING_APPROVED: 'BOOKING_APPROVED',
    BOOKING_REJECTED: 'BOOKING_REJECTED',
    REMINDER_SENT: 'REMINDER_SENT',
    GENERAL: 'GENERAL'
});

// ─── Creation Methods ────────────────────────────────────────────────

/**
 * Notify organizer when event status changes (approved/rejected).
 * @param {Object} event - Event document (must have organizer, name, _id)
 * @param {string} status - 'approved' or 'rejected'
 */
async function notifyEventStatusChange(event, status) {
    try {
        const category = status === 'approved' ? CATEGORIES.EVENT_APPROVED : CATEGORIES.EVENT_REJECTED;
        const uiType = status === 'approved' ? 'success' : 'error';

        await Notification.create({
            recipient: event.organizer,
            message: `Your event "${event.name}" has been ${status}.`,
            type: uiType,
            category,
            relatedEvent: event._id
        });
    } catch (err) {
        console.error('[NotificationService] notifyEventStatusChange failed:', err.message);
    }
}

/**
 * Notify booker when equipment booking status changes.
 * @param {Object} booking - EquipmentBooking document (must have bookedBy, _id)
 * @param {string} equipName - Equipment name string
 * @param {string} status - 'approved' or 'rejected'
 */
async function notifyBookingStatusChange(booking, equipName, status) {
    try {
        const category = status === 'approved' ? CATEGORIES.BOOKING_APPROVED : CATEGORIES.BOOKING_REJECTED;
        const uiType = status === 'approved' ? 'success' : 'error';

        await Notification.create({
            recipient: booking.bookedBy,
            message: `Your equipment booking for "${equipName}" has been ${status}.`,
            type: uiType,
            category,
            relatedBooking: booking._id
        });
    } catch (err) {
        console.error('[NotificationService] notifyBookingStatusChange failed:', err.message);
    }
}

/**
 * Notify all admins of a new equipment booking request.
 * @param {Object} booking - EquipmentBooking document
 * @param {string} equipmentName - Equipment name string
 */
async function notifyAdminsOfBooking(booking, equipmentName) {
    try {
        const admins = await User.find({ role: 'admin' }).select('_id');
        const notifications = admins.map(admin => ({
            recipient: admin._id,
            message: `New equipment booking request for "${equipmentName}"`,
            type: 'info',
            category: CATEGORIES.BOOKING_CREATED,
            relatedBooking: booking._id
        }));
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (err) {
        console.error('[NotificationService] notifyAdminsOfBooking failed:', err.message);
    }
}

/**
 * Send reminder notifications to all attendees for an event.
 * @param {Object} event - Event document (must have name, attendees[], startTime, _id)
 * @param {string} timeStr - Formatted time string for display
 * @returns {number} Number of reminders sent
 */
async function notifyEventReminders(event, timeStr) {
    try {
        const notifications = event.attendees.map(attendeeId => ({
            recipient: attendeeId,
            message: `Reminder: "${event.name}" is happening tomorrow at ${timeStr}`,
            type: 'info',
            category: CATEGORIES.REMINDER_SENT,
            relatedEvent: event._id
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
        return notifications.length;
    } catch (err) {
        console.error('[NotificationService] notifyEventReminders failed:', err.message);
        return 0;
    }
}

// ─── Role-Based Fetch Methods ────────────────────────────────────────

/**
 * Get all notifications (admin global view).
 * @param {number} limit - Max results (default 10)
 */
async function getAdminNotifications(limit = 10) {
    return Notification.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('relatedEvent', 'name status')
        .populate('relatedBooking')
        .lean();
}

/**
 * Get notifications for a specific user (club lead or student).
 * @param {string} userId - User ObjectId
 * @param {number} limit - Max results (default 10)
 */
async function getUserNotifications(userId, limit = 10) {
    return Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('relatedEvent', 'name status')
        .populate('relatedBooking')
        .lean();
}

/**
 * Alias for getUserNotifications — club lead sees own notifications.
 */
const getClubNotifications = getUserNotifications;

module.exports = {
    CATEGORIES,
    notifyEventStatusChange,
    notifyBookingStatusChange,
    notifyAdminsOfBooking,
    notifyEventReminders,
    getAdminNotifications,
    getClubNotifications,
    getUserNotifications
};
