// src/utils/equipmentConflictChecker.js

const EquipmentBooking = require('../models/EquipmentBooking');
const Equipment = require('../models/Equipment');

/**
 * Check if booking the requested quantity of equipment
 * for the given date/time range would exceed availability.
 *
 * @param {string} equipmentId - Equipment ObjectId
 * @param {Date|string} date - Booking date
 * @param {number} startTime - Minutes from midnight
 * @param {number} endTime - Minutes from midnight
 * @param {number} requestedQty - Quantity requested
 * @returns {Object} { conflict: boolean, available: number, total: number }
 */
async function checkEquipmentConflict(equipmentId, date, startTime, endTime, requestedQty) {
    const start = Number(startTime);
    const end = Number(endTime);
    const qty = Number(requestedQty);

    if (isNaN(start) || isNaN(end) || isNaN(qty)) {
        return { conflict: true, available: 0, total: 0 };
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment || equipment.isDeleted) {
        return { conflict: true, available: 0, total: 0 };
    }

    // Find all overlapping bookings that are approved or pending
    const overlapping = await EquipmentBooking.find({
        equipment: equipmentId,
        date: date,
        status: { $in: ['approved', 'pending'] },
        startTime: { $lt: end },
        endTime: { $gt: start }
    });

    // Sum the quantity of all overlapping bookings
    const bookedQty = overlapping.reduce((sum, booking) => sum + booking.quantity, 0);
    const available = equipment.totalQuantity - bookedQty;

    return {
        conflict: qty > available,
        available: Math.max(0, available),
        total: equipment.totalQuantity
    };
}

module.exports = checkEquipmentConflict;
