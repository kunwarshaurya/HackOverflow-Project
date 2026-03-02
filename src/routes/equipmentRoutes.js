const express = require('express');
const router = express.Router();
const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');
const equipmentController = require('../controllers/equipmentController');
const { validateEquipmentCreation, validateBookingStatus, validateObjectId } = require('../middlewares/validationMiddleware');

// Admin: Equipment management page
router.get(
    '/',
    isAuthenticated,
    authorize('admin'),
    equipmentController.getEquipmentPage
);

// Admin: Create new equipment
router.post(
    '/',
    isAuthenticated,
    authorize('admin'),
    validateEquipmentCreation,
    equipmentController.createEquipment
);

// Admin: Soft-delete equipment
router.post(
    '/:id/delete',
    isAuthenticated,
    authorize('admin'),
    validateObjectId('id'),
    equipmentController.deleteEquipment
);

// Admin: Approve/reject equipment booking
router.post(
    '/bookings/:id/status',
    isAuthenticated,
    authorize('admin'),
    validateObjectId('id'),
    validateBookingStatus,
    equipmentController.updateBookingStatus
);

module.exports = router;
