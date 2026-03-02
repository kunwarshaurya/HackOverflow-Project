// src/middlewares/ownershipMiddleware.js
// Entity ownership verification guards.

const Event = require('../models/Event');
const EquipmentBooking = require('../models/EquipmentBooking');
const mongoose = require('mongoose');

/**
 * Verify that the currently logged-in club_lead owns the event being modified.
 * Admins bypass this check entirely.
 *
 * Expects req.params.id to be the event ObjectId.
 */
exports.verifyEventOwnership = async (req, res, next) => {
    try {
        const eventId = req.params.id;

        if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(404).render('error', {
                title: '404 - Not Found',
                error: 'Event not found.',
                statusCode: 404
            });
        }

        // Admin bypass — admins can modify any event
        if (req.user && req.user.role === 'admin') {
            return next();
        }

        const event = await Event.findById(eventId).select('organizer club').lean();

        if (!event) {
            return res.status(404).render('error', {
                title: '404 - Not Found',
                error: 'Event not found.',
                statusCode: 404
            });
        }

        // Club lead must be the organizer of this event
        const userId = req.user.id || req.user._id;
        if (event.organizer.toString() !== userId.toString()) {
            return res.status(403).render('error', {
                title: '403 - Forbidden',
                error: 'You do not have permission to modify this event.',
                statusCode: 403
            });
        }

        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Verify that the currently logged-in user owns the equipment booking.
 * Admins bypass this check entirely.
 *
 * Expects req.params.id to be the booking ObjectId.
 */
exports.verifyBookingOwnership = async (req, res, next) => {
    try {
        const bookingId = req.params.id;

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(404).render('error', {
                title: '404 - Not Found',
                error: 'Booking not found.',
                statusCode: 404
            });
        }

        // Admin bypass
        if (req.user && req.user.role === 'admin') {
            return next();
        }

        const booking = await EquipmentBooking.findById(bookingId).select('bookedBy').lean();

        if (!booking) {
            return res.status(404).render('error', {
                title: '404 - Not Found',
                error: 'Booking not found.',
                statusCode: 404
            });
        }

        const userId = req.user.id || req.user._id;
        if (booking.bookedBy.toString() !== userId.toString()) {
            return res.status(403).render('error', {
                title: '403 - Forbidden',
                error: 'You do not have permission to modify this booking.',
                statusCode: 403
            });
        }

        next();
    } catch (err) {
        next(err);
    }
};
