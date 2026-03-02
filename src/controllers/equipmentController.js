// src/controllers/equipmentController.js

const Equipment = require('../models/Equipment');
const EquipmentBooking = require('../models/EquipmentBooking');
const checkEquipmentConflict = require('../utils/equipmentConflictChecker');
const notificationService = require('../services/notificationService');

// ================= ADMIN: List equipment + bookings =================
exports.getEquipmentPage = async (req, res) => {
    try {
        const equipment = await Equipment.find({ isDeleted: false }).sort({ name: 1 });

        const pendingBookings = await EquipmentBooking.find({ status: 'pending' })
            .populate('equipment', 'name category')
            .populate('event', 'name date')
            .populate('bookedBy', 'name email')
            .sort({ createdAt: -1 });

        res.render('admin/equipment', {
            title: 'Equipment Management',
            equipment,
            pendingBookings,
            error: null,
            success: null
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to load equipment page',
            statusCode: 500
        });
    }
};

// ================= ADMIN: Create equipment =================
exports.createEquipment = async (req, res) => {
    try {
        const { name, category, totalQuantity, description } = req.body;

        if (!name || !category || !totalQuantity) {
            const equipment = await Equipment.find({ isDeleted: false }).sort({ name: 1 });
            const pendingBookings = await EquipmentBooking.find({ status: 'pending' })
                .populate('equipment', 'name category')
                .populate('event', 'name date')
                .populate('bookedBy', 'name email');

            return res.render('admin/equipment', {
                title: 'Equipment Management',
                equipment,
                pendingBookings,
                error: 'Name, category, and quantity are required',
                success: null
            });
        }

        await Equipment.create({
            name: name.trim(),
            category: category.trim(),
            totalQuantity: Number(totalQuantity),
            description: description ? description.trim() : ''
        });

        res.redirect('/admin/equipment');
    } catch (error) {
        if (error.code === 11000) {
            const equipment = await Equipment.find({ isDeleted: false }).sort({ name: 1 });
            const pendingBookings = await EquipmentBooking.find({ status: 'pending' })
                .populate('equipment', 'name category')
                .populate('event', 'name date')
                .populate('bookedBy', 'name email');

            return res.render('admin/equipment', {
                title: 'Equipment Management',
                equipment,
                pendingBookings,
                error: 'Equipment with that name already exists',
                success: null
            });
        }
        res.redirect('/admin/equipment');
    }
};

// ================= ADMIN: Soft delete equipment =================
exports.deleteEquipment = async (req, res) => {
    try {
        await Equipment.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect('/admin/equipment');
    } catch (error) {
        res.redirect('/admin/equipment');
    }
};

// ================= ADMIN: Approve/reject booking =================
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['approved', 'rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.redirect('/admin/equipment');
        }

        const booking = await EquipmentBooking.findById(req.params.id)
            .populate('equipment', 'name');
        if (!booking) {
            return res.redirect('/admin/equipment');
        }

        if (booking.status !== 'pending') {
            return res.redirect('/admin/equipment');
        }

        // If approving, re-check conflict to prevent race conditions
        if (status === 'approved') {
            const result = await checkEquipmentConflict(
                booking.equipment._id || booking.equipment,
                booking.date,
                booking.startTime,
                booking.endTime,
                booking.quantity
            );

            if (result.conflict) {
                const availableWithout = result.available + booking.quantity;
                if (booking.quantity > availableWithout) {
                    return res.redirect('/admin/equipment');
                }
            }
        }

        booking.status = status;
        await booking.save();

        // Notify the person who booked
        const equipName = booking.equipment && booking.equipment.name
            ? booking.equipment.name
            : 'equipment';

        await notificationService.notifyBookingStatusChange(booking, equipName, status);

        res.redirect('/admin/equipment');
    } catch (error) {
        res.redirect('/admin/equipment');
    }
};


