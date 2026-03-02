// src/utils/notifyAdmins.js

const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Notify all admins about a new equipment booking request.
 * @param {Object} booking - The EquipmentBooking document
 * @param {string} equipmentName - Name of the equipment
 */
async function notifyAdminsOfBooking(booking, equipmentName) {
    try {
        const admins = await User.find({ role: 'admin' }).select('_id');
        const notifications = admins.map(admin => ({
            recipient: admin._id,
            message: `New equipment booking request for "${equipmentName}"`,
            type: 'info',
            relatedBooking: booking._id
        }));
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (err) {
        // Non-critical — don't break the flow
    }
}

module.exports = { notifyAdminsOfBooking };
