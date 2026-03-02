const mongoose = require('mongoose');

const EquipmentBookingSchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Number,
        required: true,
        min: 0,
        max: 1439
    },
    endTime: {
        type: Number,
        required: true,
        min: 0,
        max: 1439
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

EquipmentBookingSchema.index({ equipment: 1, date: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.models.EquipmentBooking || mongoose.model('EquipmentBooking', EquipmentBookingSchema);
