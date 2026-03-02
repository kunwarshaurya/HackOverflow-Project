const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    totalQuantity: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Equipment || mongoose.model('Equipment', EquipmentSchema);
