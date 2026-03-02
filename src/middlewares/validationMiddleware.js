// src/middlewares/validationMiddleware.js
// Centralized request-body validation for critical routes.

const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// ─── Helper: process validation errors and redirect with flash-style message ───
function handleErrors(redirectPath) {
    return (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msg = errors.array()[0].msg;
            // For MVC: redirect back with a generic error query param
            // Controllers can read req.query.error if needed
            return res.redirect(redirectPath + '?error=' + encodeURIComponent(msg));
        }
        next();
    };
}

// ─── Helper: strip any property from req.body that is NOT in the allowed list ──
function sanitizeBody(allowedFields) {
    return (req, _res, next) => {
        if (req.body && typeof req.body === 'object') {
            const cleaned = {};
            for (const key of allowedFields) {
                if (req.body[key] !== undefined) {
                    cleaned[key] = req.body[key];
                }
            }
            // Preserve array-notation fields (e.g. equipmentIds[])
            for (const key of Object.keys(req.body)) {
                if (key.endsWith('[]') && !cleaned[key]) {
                    cleaned[key] = req.body[key];
                }
            }
            req.body = cleaned;
        }
        next();
    };
}

// ─── Helper: validate that a URL param is a valid MongoDB ObjectId ──────────
function validateObjectId(paramName) {
    return (req, res, next) => {
        const value = req.params[paramName];
        if (!value || !mongoose.Types.ObjectId.isValid(value)) {
            return res.status(404).render('error', {
                title: '404 - Not Found',
                error: 'The requested resource was not found.',
                statusCode: 404
            });
        }
        next();
    };
}

// ======================================================================
// EVENT CREATION VALIDATION
// ======================================================================
const eventCreationAllowedFields = [
    'name', 'description', 'venueId', 'clubId', 'date',
    'startTime', 'endTime', 'budget', 'collaboratorIds',
    'equipmentIds', 'equipmentQtys', 'capacity'
];

const validateEventCreation = [
    sanitizeBody(eventCreationAllowedFields),
    body('name')
        .trim()
        .notEmpty().withMessage('Event name is required')
        .isLength({ min: 2, max: 200 }).withMessage('Event name must be 2–200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 5, max: 5000 }).withMessage('Description must be 5–5000 characters'),
    body('venueId')
        .notEmpty().withMessage('Venue is required')
        .custom(v => mongoose.Types.ObjectId.isValid(v)).withMessage('Invalid venue'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('startTime')
        .notEmpty().withMessage('Start time is required'),
    body('endTime')
        .notEmpty().withMessage('End time is required'),
    body('budget')
        .notEmpty().withMessage('Budget is required')
        .isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
    handleErrors('/club/create-event')
];

// ======================================================================
// EVENT STATUS UPDATE VALIDATION (admin approve/reject)
// ======================================================================
const eventStatusAllowedFields = ['status', 'comments'];

const validateEventStatus = [
    sanitizeBody(eventStatusAllowedFields),
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
    handleErrors('/admin/dashboard')
];

// ======================================================================
// EQUIPMENT CREATION VALIDATION
// ======================================================================
const equipmentCreationAllowedFields = ['name', 'category', 'totalQuantity', 'description'];

const validateEquipmentCreation = [
    sanitizeBody(equipmentCreationAllowedFields),
    body('name')
        .trim()
        .notEmpty().withMessage('Equipment name is required')
        .isLength({ max: 200 }).withMessage('Name must be under 200 characters'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    body('totalQuantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    handleErrors('/admin/equipment')
];

// ======================================================================
// BOOKING STATUS UPDATE VALIDATION
// ======================================================================
const bookingStatusAllowedFields = ['status'];

const validateBookingStatus = [
    sanitizeBody(bookingStatusAllowedFields),
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
    handleErrors('/admin/equipment')
];

module.exports = {
    validateObjectId,
    sanitizeBody,
    validateEventCreation,
    validateEventStatus,
    validateEquipmentCreation,
    validateBookingStatus
};
